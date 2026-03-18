import { DonderHiroba } from "hiroba-js";
import { TokenManager } from "./TokenManager";
import { SongScoreData, TaikoProfile } from "./types";

export class Crawler {
    private log(message: string) {
        console.log(`[${new Date().toLocaleTimeString()}] [Crawler] ${message}`);
    }

    private warn(message: string) {
        console.warn(`[${new Date().toLocaleTimeString()}] [Crawler] ${message}`);
    }

    private error(message: string) {
        console.error(`[${new Date().toLocaleTimeString()}] [Crawler] ${message}`);
    }

    async crawl(taikoNo: string) {
        this.log(`Starting crawl for TaikoNo: ${taikoNo}`);
        
        const taikoProfile = await this.crawlTaikoProfile(taikoNo);
        if (!taikoProfile) {
            this.error(`Failed to get profile for ${taikoNo}`);
            return;
        }
        this.log(`Profile loaded: ${taikoProfile.nickname}`);

        const clearData = await this.crawlClearData(taikoNo);
        if (!clearData || !clearData.length) {
            this.error(`Failed to get clear data for ${taikoNo}`);
            return;
        }
        this.log(`Clear data loaded: ${clearData.length} items`);

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

        this.log(`Targets for detailed score: ${scoreDataCrawlTargets.length}`);

        const scoreDataMap: Record<string, SongScoreData> = {};
        let count = 0;
        for (const target of scoreDataCrawlTargets) {
            count++;
            if (count % 10 === 0 || count === scoreDataCrawlTargets.length) {
                this.log(`Progress: ${count}/${scoreDataCrawlTargets.length}`);
            }

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

        this.log(`Crawl finished for ${taikoNo}`);
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
                this.warn(`Retry profile crawl (${retry + 1}/5)`);
                token = await TokenManager.renewToken();
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
                this.warn(`Retry clear data crawl (${retry + 1}/5)`);
                token = await TokenManager.renewToken();
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
            }
        }
        if (retry >= 5) {
            return false;
        }
    }
}