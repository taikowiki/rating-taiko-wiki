import type { SongData } from "@taiko-wiki/taikowiki-api/types";
import { DBConnector, QueryBuilder } from "@yowza/db-handler";
import type { InferDBSchema } from "@yowza/db-handler/types";
import type { User } from "../user";
import { CONST } from "../util";

export const wikiDBConnector = new DBConnector({
    host: process.env.WIKI_DB_HOST,
    port: process.env.WIKI_DB_PORT,
    user: process.env.WIKI_DB_USER,
    database: process.env.WIKI_DB_DATABASE,
    password: process.env.WIKI_DB_PASSWORD
});

export const wikiQueryBuilder = new QueryBuilder({
    'user/data': {
        order: ['number'],
        provider: ['string'],
        providerId: ['string'],
        nickname: ['string'],
        UUID: ['string'],
        grade: ['number'],
        registerTime: ['number'],
        registerTimeStamp: ['date'],
        providerUserData: ['string', 'null'],
        lang: ['string'],
        showRatingNickname: ['number'],
        showRatingTaikoNo: ['number'],
        showRatingSongs: ['number']
    },
    'user/donder_data': {
        order: ['number'],
        UUID: ['string'],
        donder: ['string'],
        clearData: ['string', 'null'],
        scoreData: ['string', 'null'],
        currentRating: ['number', 'null'],
        currentExp: ['number', 'null'],
        ratingHistory: ['string'],
        expHistory: ['string'],
        lastUpdate: ['date'],
        ratingData: ['string', 'null'],
        lastRatingCalculate: ['date', 'null']
    },
    song: {
        songNo: ['string'],
        order: ['number'],
        title: ['string'],
        titleKo: ['string', 'null'],
        aliasKo: ['string', 'null'],
        titleEn: ['string', 'null'],
        aliasEn: ['string', 'null'],
        romaji: ['string', 'null'],
        bpm: ['string'],
        bpmShiver: ['number'],
        version: ['string'],
        isAsiaBanned: ['number'],
        isKrBanned: ['number'],
        genre: ['string'],
        artists: ['string'],
        addedDate: ['number', 'null'],
        courses: ['string'],
        isDeleted: ['number']
    },
});
export type WikiDBSchema = InferDBSchema<typeof wikiQueryBuilder['dbSchema']>;

export const queryBuilder = new QueryBuilder({
    'user/profile': {
        order: ['number'],
        UUID: ['string'],
        nickname: ['string'],
        bio: ['string']
    },
    'user/taikoProfile': {
        order: ['number'],
        UUID: ['string'],
        taikoNumber: ['string'],
        nickname: ['string'],
        dan: ['number', 'null'],
        danType: ['number', 'null'],
        danFrame: ['number', 'null'],
        dfc: ['number', 'null'],
        fc: ['number', 'null'],
        clear: ['number', 'null'],
        rainbow: ['number', 'null'],
        purple: ['number', 'null'],
        pink: ['number', 'null'],
        gold: ['number', 'null'],
        silver: ['number', 'null'],
        bronze: ['number', 'null'],
        white: ['number', 'null'],
    },
    
});
export type DBSchema = InferDBSchema<typeof queryBuilder['dbSchema']>;

export const dbConverter = {
    fromDB: {
        song<K extends keyof WikiDBSchema['song']>(data: Pick<WikiDBSchema['song'], K>): Pick<SongData, Exclude<K, 'order'>> {
            const songData: Partial<SongData> = {};
            Object.keys(data).forEach((_) => {
                const key = _ as K;
                if (key === "courses") {
                    songData.courses = JSON.parse((data as WikiDBSchema['song']).courses);
                    if (songData.courses && !songData.courses?.ura) {
                        songData.courses.ura = null;
                    }
                }
                else if (key === "bpm") {
                    songData.bpm = JSON.parse((data as WikiDBSchema['song']).bpm);
                }
                else if (key === "version") {
                    songData.version = JSON.parse((data as WikiDBSchema['song']).version)
                }
                else if (key === "genre") {
                    songData.genre = JSON.parse((data as WikiDBSchema['song']).genre)
                }
                else if (key === "artists") {
                    songData.artists = JSON.parse((data as WikiDBSchema['song']).artists)
                }
                else if (key === "order") {
                    return;
                }
                else {
                    //@ts-expect-error
                    songData[key] = data[key];
                }
            });
            return songData as Pick<SongData, Exclude<K, 'order'>>;
        },
        taikoProfile(data: DBSchema['user/taikoProfile']): User.TaikoProfile {
            return {
                taikoNo: data.taikoNumber,
                nickname: data.nickname,
                dani: (data.dan && data.danType && data.danFrame) ? {
                    dan: CONST.DANI.NIJIIRO_REGULAR_DAN[data.dan - 1],
                    frame: (['silver', 'gold', 'rainbow'] as const)[data.danFrame - 1],
                    type: (['red', 'gold'] as const)[data.danType - 1]
                } : null,
                crown: {
                    donderfull: data.dfc ?? 0,
                    gold: data.fc ?? 0,
                    silver: data.clear ?? 0
                },
                badge: {
                    rainbow: data.rainbow ?? 0,
                    purple: data.purple ?? 0,
                    pink: data.pink ?? 0,
                    gold: data.gold ?? 0,
                    silver: data.silver ?? 0,
                    bronze: data.bronze ?? 0,
                    white: data.white ?? 0,
                }
            }
        }
    },
    toDB: {
        taikoProfile(taikoProfile: User.TaikoProfile): Omit<DBSchema['user/taikoProfile'], 'order' | 'UUID'> {
            return {
                taikoNumber: taikoProfile.taikoNo,
                nickname: taikoProfile.nickname,
                dan: taikoProfile.dani ? CONST.DANI.NIJIIRO_REGULAR_DAN.indexOf(taikoProfile.dani.dan) + 1 : null,
                danFrame: taikoProfile.dani ? ['silver', 'gold', 'rainbow'].indexOf(taikoProfile.dani.frame) + 1 : null,
                danType: taikoProfile.dani ? ['red', 'gold'].indexOf(taikoProfile.dani.type) + 1 : null,
                dfc: taikoProfile.crown.donderfull,
                fc: taikoProfile.crown.gold,
                clear: taikoProfile.crown.silver,
                rainbow: taikoProfile.badge.rainbow,
                purple: taikoProfile.badge.purple,
                pink: taikoProfile.badge.pink,
                gold: taikoProfile.badge.gold,
                silver: taikoProfile.badge.rainbow,
                bronze: taikoProfile.badge.bronze,
                white: taikoProfile.badge.white,
            }
        }
    }
}