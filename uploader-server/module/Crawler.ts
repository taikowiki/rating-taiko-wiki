import { DonderHiroba } from "hiroba-js";
import { TokenManager } from "./TokenManager";
import { SongScoreData, TaikoProfile } from "./types";

export class Crawler {
    async crawl(taikoNo: string) {
        const taikoProfile = await this.crawlTaikoProfile(taikoNo);
        if (!taikoProfile) {
            return;
        }

        const clearData = await this.crawlClearData(taikoNo);
        if (!clearData || !clearData.length) {
            return;
        }

        const scoreDataCrawlTargets: { songNo: string, diff: 'oni' | 'ura' }[] = [];
        clearData.forEach((c) => {
            (['oni', 'ura'] as const).forEach((diff) => {
                if (c.difficulty?.[diff]?.crown) {
                    scoreDataCrawlTargets.push({
                        songNo: c.songNo,
                        diff
                    });
                }
            })
        });

        const scoreDataMap: Record<string, SongScoreData> = {};
        for (const target of scoreDataCrawlTargets) {
            const scoreData = await this.crawlScoreData(taikoNo, target.songNo, target.diff);
            if (!scoreData) continue;

            const diffScoreData = scoreData.difficulty[target.diff];
            if (diffScoreData) {
                diffScoreData.ranking = 0;
            }

            if (!scoreDataMap[scoreData.songNo]) {
                scoreDataMap[scoreData.songNo] = scoreData;
            }
            else {
                scoreDataMap[scoreData.songNo].difficulty[target.diff] = scoreData.difficulty[target.diff];
            }
        }

        return {
            scoreData: scoreDataMap,
            clearData,
            taikoProfile
        }
    }

    private async crawlTaikoProfile(taikoNo: string): Promise<TaikoProfile | null | false> {
        let retry = 0;
        let token = await TokenManager.getToken();
        for (; retry < 5; retry++) {
            try {
                const cardData = await DonderHiroba.func.getCardData({
                    token,
                    taikoNo
                });

                if (!cardData) return null;

                return {
                    nickname: cardData.nickname,
                    taikoNo: cardData.taikoNumber,
                    crown: cardData.summary?.crown ?? defaultCrown(),
                    badge: cardData.summary?.badge ?? defaultBadge(),
                    dani: null
                }
            }
            catch{
                token = await TokenManager.renewToken();
                retry++;
            }
        }
        return null;

        function defaultCrown() {
            return {
                donderfull: 0,
                gold: 0,
                silver: 0
            }
        }

        function defaultBadge() {
            return {
                rainbow: 0,
                purple: 0,
                pink: 0,
                gold: 0,
                silver: 0,
                bronze: 0,
                white: 0
            }
        }
    }

    private async crawlClearData(taikoNo: string) {
        let retry = 0;
        let token = await TokenManager.getToken();
        for (; retry < 5; retry++) {
            try {
                return await DonderHiroba.func.getClearData({
                    token,
                    taikoNo
                })
            }
            catch {
                token = await TokenManager.renewToken();
                retry++;
            }
        }
        if (retry >= 5) {
            return false;
        }
    }

    private async crawlScoreData(taikoNo: string, songNo: string, diff: 'oni' | 'ura') {
        let retry = 0;
        let token = await TokenManager.getToken();
        for (; retry < 5; retry++) {
            try {
                return await DonderHiroba.func.getScoreData({
                    token,
                    taikoNo,
                    songNo,
                    difficulty: diff
                })
            }
            catch {
                token = await TokenManager.renewToken();
                retry++;
            }
        }
        if (retry >= 5) {
            return false;
        }
    }
}