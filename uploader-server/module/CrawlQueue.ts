import { Database } from 'bun:sqlite';
import { TokenManager } from './TokenManager';
import { DonderHiroba, ScoreData } from 'hiroba-js';
import LZUTF8 from 'lzutf8';

export class CrawlQueue {
    db: Database;
    current: CrawlQueue.QueueElement | null = null;

    constructor() {
        this.db = new Database('crawl_queue.db');
        this.db.run(`
            CREATE TABLE IF NOT EXISTS queue (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                taikoNo TEXT NOT NULL,
                UUID TEXT NOT NULL UNIQUE,
                createdTime INTEGER NOT NULL
            );
        `);
    }

    enqueue(data: CrawlQueue.QueueElement): boolean {
        try {
            this.db.run("INSERT INTO queue (taikoNo, UUID, createdTime) VALUES (?, ?, ?)", [data.taikoNo, data.UUID, Date.now()]);
            queueMicrotask(() => this.run());
            return true;
        }
        catch {
            return false;
        }
    }

    private dequeue() {
        const rows = this.db.query<CrawlQueue.QueueElement, []>(`
            DELETE FROM queue
            WHERE id = (
                SELECT id FROM queue
                ORDER BY id ASC
                LIMIT 1
            )
            RETURNING taikoNo, uuid;
        `).get();
        return rows;
    }

    getPosition(UUID: string) {
        const row = this.db.query<{ 'position': number } & CrawlQueue.QueueElement, [UUID: string]>(`
            SELECT COUNT(*) as position, taikoNo, UUID FROM queue
            WHERE id < (
                SELECT id FROM queue
                WHERE UUID = ?
            )
        `).get(UUID);

        return row ?? null;
    }

    private async run() {
        try {
            if (this.current) return;
            this.current = this.dequeue();
            if (!this.current) return;

            const cardData = await this.crawlCardData(this.current.taikoNo);
            if (!cardData) {
                return;
            }

            const clearData = await this.crawlClearData(this.current.taikoNo);
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

            const scoreDataMap: Record<string, ScoreData> = {};
            for (const target of scoreDataCrawlTargets) {
                const scoreData = await this.crawlScoreData(this.current.taikoNo, target.songNo, target.diff);
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

            await fetch('https://rating.taiko.wiki/api/internal/upload-rating-data', {
                method: 'POST',
                headers: {
                    'x-internal-key': process.env.INTERNAL_API_KEY,
                    'content-type': 'application/json'
                },
                body: LZUTF8.compress(JSON.stringify({
                    UUID: this.current.UUID,
                    taikoProfile: {
                        taikoNo: cardData.taikoNumber,
                        nickname: cardData.nickname,
                        crown: cardData.summary?.crown,
                        badge: cardData.summary?.badge,
                        dani: null
                    },
                    clearData,
                    scoreData: scoreDataMap
                }))
            })

        }
        catch (err) {
            console.error(err);
        }
        finally {
            this.current = null;
            return setImmediate(() => this.run());
        }
    }

    private async crawlCardData(taikoNo: string) {
        let retry = 0;
        let token = await TokenManager.getToken();
        for (; retry < 5; retry++) {
            try {
                return await DonderHiroba.func.getCardData({
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

export namespace CrawlQueue {
    export type QueueElement = {
        taikoNo: string;
        UUID: string;
    }
}