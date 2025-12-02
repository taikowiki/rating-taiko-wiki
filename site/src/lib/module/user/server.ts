import type { InferDBSchema } from "@yowza/db-handler/types";
import { calcualteRating, type User } from ".";
import { dbConverter, queryBuilder, wikiDBConnector, wikiQueryBuilder, type DBSchema, type WikiDBSchema } from "../db/server";
import { defineDBHandler, runQuery } from "@yowza/db-handler";
import type { ScoreData } from "hiroba-js";
import type { RatingData } from "@taiko-wiki/taikowiki-api";
import { songDBController } from "../song/server";
import { fetchMeasures } from "@taiko-wiki/taiko-rating";

export namespace wikiUserDBController {
    export const getDataByProvider = wikiDBConnector.defineDBHandler<[provider: string, providerId: string], User.Data | null>((provider, providerId) => {
        return async (run) => {
            const rows = await wikiQueryBuilder
                .select('user/data', () => ({ provider: 'provider', providerId: 'providerId', UUID: 'UUID', lang: 'lang', grade: 'grade' }))
                .where(({ compare, column, value }) => [
                    compare(column('provider'), '=', value(provider)),
                    compare(column('providerId'), '=', value(providerId))
                ])
                .execute(run);

            if (rows.length !== 0) {
                return parseWikiUserData(rows[0]);
            }

            return null;
        }
    });
    export const getDonderData = wikiDBConnector.defineDBHandler<[UUID: string], WikiDBSchema['user/donder_data'] | null>((UUID) => {
        return async (run) => {
            const rows = await wikiQueryBuilder
                .select('user/donder_data', '*')
                .where(({ compare, column, value }) => [compare(column('UUID'), '=', value(UUID))])
                .execute(run);

            if (rows.length === 0) return null;
            return rows[0];
        }
    });
    export const updateClearData = wikiDBConnector.defineDBHandler<[UUID: string, taikoProfile: User.TaikoProfile, clearDatas: User.ClearData[]]>((UUID, taikoProfile, clearDatas) => {
        const clearDatasJson = JSON.stringify(clearDatas);
        const donder = {
            nickname: taikoProfile.nickname,
            taikoNumber: taikoProfile.taikoNo,
            myDon: `https://img.taiko-p.jp/imgsrc.php?v=&kind=mydon&fn=mydon_${taikoProfile.taikoNo}`
        };

        const query = wikiQueryBuilder.insert('user/donder_data')
            .set(({ value }) => ({
                UUID: value(UUID),
                donder: value(JSON.stringify(donder)),
                clearData: value(clearDatasJson)
            }))
            .onDuplicate('update', ({ raw }) => ({
                UUID: raw('VALUES(`UUID`)'),
                donder: raw('VALUES(`donder`)'),
                clearData: raw('VALUES(`clearData`)')
            }))

        return async (run) => {
            await query.execute(run);
        }
    })
    function parseWikiUserData<const T extends Partial<InferDBSchema<typeof wikiQueryBuilder.dbSchema>['user/data']>>(data: T) {
        type Return = T extends Partial<InferDBSchema<typeof wikiQueryBuilder.dbSchema>['user/data']> ? Pick<User.Data, Extract<keyof T, keyof User.Data>> : never;

        const userData: Partial<User.Data> = {};
        if (data.UUID) {
            userData.UUID = data.UUID;
        }
        if (data.provider) {
            userData.provider = data.provider;
        }
        if (data.providerId) {
            userData.providerId = data.providerId;
        }
        if (data.lang) {
            userData.lang = data.lang;
        }
        if (data.grade) {
            userData.grade = data.grade;
        }

        return userData as Return;
    }
}
export namespace userDBController {
    export const getSimplifiedRatingData = defineDBHandler<[UUID: string], Omit<User.RatingData, 'scoreData' | 'songRatingDatas'> | null>((UUID) => {
        const query = queryBuilder
            .select('user/rating_data', '*')
            .where(({ compare, column, value }) => [compare(column('UUID'), '=', value(UUID))]);
        return async (run) => {
            const rows = await query.execute(run);

            if (rows.length === 0) return null;
            return dbConverter.fromDB.ratingData(rows[0]);
        }
    });
    export const doesRatingDataExists = defineDBHandler<[UUID: string], boolean>((UUID) => {
        const query = queryBuilder
            .select('user/rating_data', ({ count }) => ({ count: count() }))
            .where(({ compare, column, value }) => [compare(column('UUID'), '=', value(UUID))]);
        return async (run) => {
            const rows = await query.execute(run);

            if (rows?.[0]?.count) return true;
            return false;
        }
    });
    export const getRankingByRatingScore = defineDBHandler<[ratingScore: number], number>((ratingScore) => {
        const query = queryBuilder
            .select('user/rating_data', ({ count }) => ({ count: count() }))
            .where(({ compare, column, value }) => [compare(column('currentRatingScore'), '>', value(ratingScore))]);

        return async (run) => {
            const rows = await query.execute(run);

            return (rows?.[0]?.count ?? 0) + 1;
        }
    });
    export const updateProfile = defineDBHandler<[UUID: string, profile: Omit<User.Profile, 'UUID'>]>((UUID, profile) => {
        const query = queryBuilder.insert('user/profile')
            .set(({ value }) => ({
                UUID: value(UUID),
                nickname: value(profile.nickname),
                bio: value(profile.bio)
            }))
            .onDuplicate('update', ({ raw }) => ({
                nickname: raw('VALUES(`nickname`)'),
                bio: raw('VALUES(`bio`)')
            }));
        return async (run) => {
            await query.execute(run);
        }
    });

    export const updateProfileOption = defineDBHandler<[UUID: string, option: User.ProfileOption]>((UUID, option) => {
        const dbData = dbConverter.toDB.profileOption(option);
        const query = queryBuilder.insert('user/profile_option')
            .set(({ value }) => ({
                UUID: value(UUID),
                hideDan: value(dbData.hideDan)
            }))
            .onDuplicate('update', ({ raw }) => ({
                hideDan: raw('VALUES(`hideDan`)')
            }));
        return async (run) => {
            await query.execute(run);
        }
    })

    export const updateAllRanking = defineDBHandler(() => {
        return async (run) => {
            await run("UPDATE `user/rating_data` t1 SET `ranking` = (SELECT COUNT(*) + 1 FROM `user/rating_data` t2 INNER JOIN `user/profile` p ON p.`UUID` = t2.`UUID` WHERE t2.`currentRatingScore` > t1.`currentRatingScore`)")
        }
    })
    export const updateRatingData = defineDBHandler<[UUID: string, ratingData: User.RatingData]>((UUID, ratingData) => {
        const dbRatingData = dbConverter.toDB.ratingData(ratingData);
        const ratingDataQuery = queryBuilder.insert('user/rating_data')
            .set(({ value }) => ({
                UUID: value(UUID),
                currentRatingScore: value(dbRatingData.currentRatingScore),
                currentExp: value(dbRatingData.currentExp),
                ratingScoreHistory: value(dbRatingData.ratingScoreHistory),
                lastUpload: value(dbRatingData.lastUpload),
                ranking: value(dbRatingData.ranking),
            }))
            .onDuplicate('update', ({ raw }) => ({
                currentRatingScore: raw('VALUES(`currentRatingScore`)'),
                currentExp: raw('VALUES(`currentExp`)'),
                ratingScoreHistory: raw('VALUES(`ratingScoreHistory`)'),
                lastUpload: raw('VALUES(`lastUpload`)'),
                ranking: raw('VALUES(`ranking`)'),
            }));
        const scoreDataQuery = dbConverter.toDB.scoreData(ratingData.scoreData).map((row) => {
            return queryBuilder.insert('user/score_data')
                .set(({ value }) => ({
                    UUID: value(UUID),
                    songNo: value(row.songNo),
                    diff: value(row.diff),
                    title: value(row.title),
                    crown: value(row.crown),
                    badge: value(row.badge),
                    score: value(row.score),
                    ranking: value(row.ranking),
                    good: value(row.good),
                    ok: value(row.ok),
                    bad: value(row.bad),
                    maxCombo: value(row.maxCombo),
                    roll: value(row.roll),
                    dfcCount: value(row.dfcCount),
                    fcCount: value(row.fcCount),
                    clearCount: value(row.clearCount),
                    playCount: value(row.playCount),
                }))
                .onDuplicate('update', ({ raw }) => ({
                    title: raw('VALUES(`title`)'),
                    crown: raw('VALUES(`crown`)'),
                    badge: raw('VALUES(`badge`)'),
                    score: raw('VALUES(`score`)'),
                    ranking: raw('VALUES(`ranking`)'),
                    good: raw('VALUES(`good`)'),
                    ok: raw('VALUES(`ok`)'),
                    bad: raw('VALUES(`bad`)'),
                    maxCombo: raw('VALUES(`maxCombo`)'),
                    roll: raw('VALUES(`roll`)'),
                    dfcCount: raw('VALUES(`dfcCount`)'),
                    fcCount: raw('VALUES(`fcCount`)'),
                    clearCount: raw('VALUES(`clearCount`)'),
                    playCount: raw('VALUES(`playCount`)'),
                }));
        });
        const songRatingDataQuery = ratingData.songRatingDatas.map((d) => {
            const row = dbConverter.toDB.songRatingData(d);
            return queryBuilder.insert('user/song_rating_data')
                .set(({ value }) => ({
                    UUID: value(UUID),
                    title: value(row.title),
                    songNo: value(row.songNo),
                    difficulty: value(row.difficulty),
                    measureValue: value(row.measureValue),
                    accuracy: value(row.accuracy),
                    crown: value(row.crown),
                    badge: value(row.badge),
                    ratingScore: value(row.ratingScore),
                }))
                .onDuplicate('update', ({ raw }) => ({
                    title: raw('VALUES(title)'),
                    measureValue: raw('VALUES(measureValue)'),
                    accuracy: raw('VALUES(accuracy)'),
                    crown: raw('VALUES(crown)'),
                    badge: raw('VALUES(badge)'),
                    ratingScore: raw('VALUES(ratingScore)'),
                }));
        });

        return async (run) => {
            await ratingDataQuery.execute(run);
            for (const query of scoreDataQuery) {
                await query.execute(run);
            }
            for (const query of songRatingDataQuery) {
                await query.execute(run);
            }
            await userDBController.updateAllRanking.getCallback()(run);
        }
    });
    export const updateTaikoProfile = defineDBHandler<[UUID: string, taikoProfile: User.TaikoProfile]>((UUID, taikoProfile) => {
        const row = dbConverter.toDB.taikoProfile(taikoProfile);
        const query = queryBuilder.insert('user/taiko_profile')
            .set(({ value }) => ({
                UUID: value(UUID),
                taikoNumber: value(row.taikoNumber),
                nickname: value(row.nickname),
                dan: value(row.dan),
                danType: value(row.danType),
                danFrame: value(row.danFrame),
                dfc: value(row.dfc),
                fc: value(row.fc),
                clear: value(row.clear),
                rainbow: value(row.rainbow),
                purple: value(row.purple),
                pink: value(row.pink),
                gold: value(row.gold),
                silver: value(row.silver),
                bronze: value(row.bronze),
                white: value(row.white),
            }))
            .onDuplicate('update', ({ raw }) => ({
                taikoNumber: raw('VALUES(taikoNumber)'),
                nickname: raw('VALUES(nickname)'),
                dan: raw('VALUES(dan)'),
                danType: raw('VALUES(danType)'),
                danFrame: raw('VALUES(danFrame)'),
                dfc: raw('VALUES(dfc)'),
                fc: raw('VALUES(fc)'),
                clear: raw('VALUES(clear)'),
                rainbow: raw('VALUES(rainbow)'),
                purple: raw('VALUES(purple)'),
                pink: raw('VALUES(pink)'),
                gold: raw('VALUES(gold)'),
                silver: raw('VALUES(silver)'),
                bronze: raw('VALUES(bronze)'),
                white: raw('VALUES(white)'),
            }));
        //console.log(query.build())
        return async (run) => {
            await query.execute(run);
        }
    });
    export const getProfile = defineDBHandler<[UUID: string], User.Profile | null>((UUID) => {
        const query = queryBuilder.select('user/profile', '*')
            .where(({ compare, column, value }) => [compare(column('UUID'), '=', value(UUID))]);
        return async (run) => {
            const rows = await query.execute(run);
            if (rows.length === 0) return null;
            return {
                UUID: rows[0].UUID,
                nickname: rows[0].nickname,
                bio: rows[0].bio
            }
        }
    });

    export const getProfileOption = defineDBHandler<[UUID: string], User.ProfileOption | null>((UUID) => {
        const query = queryBuilder.select('user/profile_option', '*')
            .where(({ compare, column, value }) => [compare(column('UUID'), '=', value(UUID))]);
        return async (run) => {
            const rows = await query.execute(run);
            if (rows.length === 0) return null;
            return dbConverter.fromDB.profileOption(rows[0]);
        }
    });

    export const getTaikoProfile = defineDBHandler<[UUID: string], User.TaikoProfile | null>((UUID) => {
        const query = queryBuilder.select('user/taiko_profile', '*')
            .where(({ compare, column, value }) => [compare(column('UUID'), '=', value(UUID))]);
        return async (run) => {
            const rows = await query.execute(run);
            if (rows.length === 0) return null;
            return dbConverter.fromDB.taikoProfile(rows[0]);
        }
    });
    export const getRatingData = defineDBHandler<[UUID: string], User.RatingData | null>((UUID) => {
        const ratingDataQuery = queryBuilder.select('user/rating_data', '*')
            .where(({ compare, column, value }) => [compare(column('UUID'), '=', value(UUID))]);
        const scoreDataQuery = queryBuilder.select('user/score_data', '*')
            .where(({ compare, column, value }) => [compare(column('UUID'), '=', value(UUID))]);
        const songRatingDataQuery = queryBuilder.select('user/song_rating_data', '*')
            .where(({ compare, column, value }) => [compare(column('UUID'), '=', value(UUID))]);
        return async (run) => {
            const ratingDataRows = await ratingDataQuery.execute(run);
            if (ratingDataRows.length === 0) return null;
            const ratingData: User.RatingData = {
                ...dbConverter.fromDB.ratingData(ratingDataRows[0]),
                scoreData: {},
                songRatingDatas: []
            };

            const scoreDataRows = await scoreDataQuery.execute(run);
            ratingData.scoreData = dbConverter.fromDB.scoreData(scoreDataRows);

            const songRatingDataRows = await songRatingDataQuery.execute(run);
            ratingData.songRatingDatas = songRatingDataRows.map((row) => dbConverter.fromDB.songRatingData(row)).toSorted((a, b) => b.ratingScore - a.ratingScore);

            return ratingData;
        }
    });
    export const getRankingData = defineDBHandler<[page: number], { datas: (Pick<User.RatingData, 'ranking' | 'currentRatingScore'> & Pick<User.Profile, 'nickname' | 'UUID'>)[]; count: number; }>((page) => {
        const query = queryBuilder.select('user/rating_data', () => ({
            ranking: 'ranking',
            currentRatingScore: 'currentRatingScore'
        }))
            .join(
                'user/profile',
                () => ({ nickname: 'nickname', UUID: 'UUID' }),
                'inner',
                ({ compare, column }) => [compare(column('user/rating_data.UUID'), '=', column('user/profile.UUID'))]
            )
            .orderBy('user/rating_data.ranking', 'asc')
            .limit(50, (page - 1) * 50);
        const countQuery = queryBuilder.select('user/rating_data', ({ count }) => ({ count: count() }))
        return async (run) => {
            const datas = await query.execute(run);
            const count = await countQuery.execute(run).then((r) => r[0].count);
            return {
                datas,
                count
            }
        }
    });
    export const deleteData = defineDBHandler<[UUID: string]>((UUID) => {
        return async (run) => {
            await queryBuilder.delete('user/profile')
                .where(({ compare, column, value }) => [compare(column('UUID'), '=', value(UUID))])
                .execute(run);
            await queryBuilder.delete('user/rating_data')
                .where(({ compare, column, value }) => [compare(column('UUID'), '=', value(UUID))])
                .execute(run);
            await queryBuilder.delete('user/score_data')
                .where(({ compare, column, value }) => [compare(column('UUID'), '=', value(UUID))])
                .execute(run);
            await queryBuilder.delete('user/song_rating_data')
                .where(({ compare, column, value }) => [compare(column('UUID'), '=', value(UUID))])
                .execute(run);
            await queryBuilder.delete('user/taiko_profile')
                .where(({ compare, column, value }) => [compare(column('UUID'), '=', value(UUID))])
                .execute(run);
            await userDBController.updateAllRanking.getCallback()(run);
        }
    })
}

export async function updateRatingData(data: { UUID: string, taikoProfile: User.TaikoProfile, scoreData?: User.ScoreData, clearData?: User.ClearData[] }) {
    let currentRatingScore: number | null = null;
    const UUID = data.UUID;

    // 프로필
    /* DB 업로드 */
    await userDBController.updateTaikoProfile(UUID, data.taikoProfile);

    const now = new Date();
    const songs = await songDBController.getAllSongDatas();

    // scoreData
    if (data.scoreData) {
        /* 이전 레이팅 데이터 가져오기 */
        const formerRatingData = await userDBController.getRatingData(UUID);
        /* scoreData 병합 */
        const scoreData = formerRatingData?.scoreData ?? {};
        Object.entries(data.scoreData).forEach(([songNo, songScoreData]) => {
            if (!(songNo in scoreData)) {
                scoreData[songNo] = {
                    songNo,
                    title: songs.find((song) => song.songNo === songNo)?.title ?? '',
                    difficulty: {}
                }
            };

            Object.entries(songScoreData.difficulty).forEach(([diff, diffScoreData]) => {
                scoreData[songNo].difficulty[diff as 'oni' | 'ura'] = diffScoreData;
            })
        });
        /* songRatingData 병합을 위한 객체 */
        const songRatingDataMap: {
            [songNo: string]: Partial<Record<'oni' | 'ura', User.SongRatingData>>
        } = {};
        formerRatingData?.songRatingDatas?.forEach((data) => {
            if (!(data.songNo in songRatingDataMap)) {
                songRatingDataMap[data.songNo] = {}
            };

            songRatingDataMap[data.songNo][data.difficulty] = data;
        })

        /* 새 레이팅 계산 */
        const measures = await fetchMeasures();
        const result = calcualteRating(scoreData, measures, songs);
        /* ratingScoreHistory 병합 */
        const ratingScoreHistory = formerRatingData?.ratingScoreHistory ?? [];
        if (ratingScoreHistory.length >= 2 && ratingScoreHistory.at(-1)?.[1] === ratingScoreHistory.at(-2)?.[1] && ratingScoreHistory.at(-1)?.[1] === result.currentRatingScore) {
            ratingScoreHistory.pop();
        }
        ratingScoreHistory.push([now, result.currentRatingScore]);
        /* songRatingData 병합 */
        result.songRatingDatas.forEach((data) => {
            if (!(data.songNo in songRatingDataMap)) {
                songRatingDataMap[data.songNo] = {}
            };

            if (songRatingDataMap[data.songNo]?.[data.difficulty]?.ratingScore ?? 0 <= data.ratingScore) {
                songRatingDataMap[data.songNo][data.difficulty] = data;
            }
        });
        const songRatingDatas: User.SongRatingData[] = [];
        Object.values(songRatingDataMap).forEach((s) => {
            Object.values(s).forEach((data) => {
                songRatingDatas.push(data);
            })
        });
        songRatingDatas.sort((a, b) => b.ratingScore - a.ratingScore);

        /* 새 랭킹 계산 */
        const ranking = await userDBController.getRankingByRatingScore(result.currentRatingScore);

        // 새로 저장할 데이터
        // scoreData나 songRatingData는 업로드 된 것만 수정/추가되므로 병합 방식으로 작동함
        const ratingData: User.RatingData = {
            currentRatingScore: result.currentRatingScore,
            currentExp: result.currentExp,
            ratingScoreHistory,
            scoreData,
            songRatingDatas,
            ranking,
            lastUpload: now
        };

        await userDBController.updateRatingData(UUID, ratingData);
        currentRatingScore = result.currentRatingScore;
    }

    // clearData
    if (data.clearData) {
        await wikiUserDBController.updateClearData(UUID, data.taikoProfile, data.clearData);
    }


    return currentRatingScore;
}

/**
 * @reason `RATING_DATA_ALREADY_EXISTS`
 * @reason `DONDER_DATA_NOT_EXISTS`
 * @reason `SCORE_DATA_NOT_EXISTS`
 * @reason `RATING_DATA_NOT_EXISTS`
 */
export async function migrateRatingData(UUID: string) {
    return await runQuery(async (run) => {
        const ratingDataExists = await userDBController.doesRatingDataExists.getCallback(UUID)(run);
        if (ratingDataExists) {
            return {
                success: false,
                reason: 'RATING_DATA_ALREADY_EXISTS'
            }
        }

        const donderData = await wikiUserDBController.getDonderData(UUID);
        if (!donderData) {
            return {
                success: false,
                reason: 'DONDER_DATA_NOT_EXISTS'
            }
        }
        if (!donderData.scoreData) {
            return {
                success: false,
                reason: 'SCORE_DATA_NOT_EXISTS'
            }
        }
        if (!donderData.ratingData || typeof (donderData.currentRating) !== "number" || typeof (donderData.currentExp) !== "number") {
            return {
                success: false,
                reason: `RATING_DATA_NOT_EXISTS`
            }
        }

        const songs = await songDBController.getAllSongDatas();
        const songNoTitleMap = new Map<string, string>();

        const scoreData: User.ScoreData = JSON.parse(donderData.scoreData) as Record<string, ScoreData>;
        Object.values(scoreData).forEach((songScoreData) => {
            Object.keys(songScoreData.difficulty).forEach((diff) => {
                if (diff === "oni" || diff === "ura") return;
                delete songScoreData.difficulty[diff as keyof typeof songScoreData.difficulty];
            })
        })
        const songRatingDatas: User.SongRatingData[] = [];
        const formerRatingData = JSON.parse(donderData.ratingData) as RatingData;
        formerRatingData.forEach((d) => {
            let title = songNoTitleMap.get(d.songNo);
            if (!title) {
                title = songs.find((song) => song.songNo === d.songNo)?.title ?? '';
                songNoTitleMap.set(d.songNo, title);
            }

            songRatingDatas.push({
                title,
                songNo: d.songNo,
                difficulty: d.difficulty,
                measureValue: d.songRating.measureValue,
                accuracy: d.songRating.accuracy,
                ratingScore: d.songRating.value,
                crown: scoreData?.[d.songNo]?.difficulty?.[d.difficulty]?.crown ?? null,
                badge: scoreData?.[d.songNo]?.difficulty?.[d.difficulty]?.badge ?? null
            })
        });
        songRatingDatas.sort((a, b) => b.ratingScore - a.ratingScore);

        const ratingHistory = (JSON.parse(donderData.ratingHistory) as [number, number][]).filter((e) => Array.isArray(e)).map(([a, b]) => [new Date(a), b]) as [Date, number][];
        const ratingData: User.RatingData = {
            currentRatingScore: donderData.currentRating,
            currentExp: donderData.currentExp,
            lastUpload: donderData.lastUpdate,
            ranking: await userDBController.getRankingByRatingScore.getCallback(donderData.currentRating)(run),
            ratingScoreHistory: ratingHistory,
            scoreData,
            songRatingDatas
        };

        const donderProfile = JSON.parse(donderData.donder);
        const taikoProfile: User.TaikoProfile = {
            nickname: donderProfile.nickname,
            taikoNo: donderProfile.taikoNumber,
            crown: {
                donderfull: 0,
                gold: 0,
                silver: 0
            },
            badge: {
                rainbow: 0,
                purple: 0,
                pink: 0,
                gold: 0,
                silver: 0,
                bronze: 0,
                white: 0
            },
            dani: null
        }

        const profile = (await userDBController.getProfile(UUID)) ?? {
            UUID,
            nickname: taikoProfile.nickname,
            bio: ''
        }

        await userDBController.updateProfile(UUID, profile);
        await userDBController.updateTaikoProfile(UUID, taikoProfile);
        await userDBController.updateRatingData(UUID, ratingData);

        return {
            success: true
        }
    })
}