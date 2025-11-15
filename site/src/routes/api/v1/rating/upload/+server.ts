import { songDBController } from "$lib/module/song/server";
import { calcualteRating, User } from "$lib/module/user";
import { userDBController } from "$lib/module/user/server";
import { error, type RequestEvent } from "@sveltejs/kit";
import { fetchMeasures } from "@taiko-wiki/taiko-rating";
import LZUTF8 from "lzutf8";
import z from "zod";

export async function POST(event: RequestEvent) {
    if (!event.locals.userData) {
        throw error(403);
    }
    const UUID = event.locals.userData.UUID;

    /* 요청 데이터 검사 */
    let requestData: { taikoProfile: User.TaikoProfile, scoreData: User.ScoreData };
    try {
        const requestText = await event.request.text();
        requestData = JSON.parse(LZUTF8.decompress(requestText, { inputEncoding: 'Base64' }));
        z.object({
            taikoProfile: User.Schema.TaikoProfile,
            scoreData: User.Schema.ScoreData
        })
            .parse(requestData);
    }
    catch (err) {
        console.error(err);
        throw error(400);
    }

    const now = new Date();
    const songs = await songDBController.getAllSongDatas();

    /* 이전 레이팅 데이터 가져오기 */
    const formerRatingData = await userDBController.getRatingData(UUID);
    /* scoreData 병합 */
    const scoreData = formerRatingData?.scoreData ?? {};
    Object.entries(requestData.scoreData).forEach(([songNo, songScoreData]) => {
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

    /* DB 업로드*/
    await userDBController.updateTaikoProfile(UUID, requestData.taikoProfile);
    await userDBController.updateRatingData(UUID, ratingData);

    return new Response(JSON.stringify({
        currentRatingScore: result.currentRatingScore
    }));
}