import { Database } from 'bun:sqlite';
import { TokenManager } from './TokenManager';
import { DonderHiroba } from 'hiroba-js';
import LZUTF8 from 'lzutf8';
import { ClearData, SongScoreData, TaikoProfile, ScoreData } from './types';

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

            const taikoProfile = await this.crawlTaikoProfile(this.current.taikoNo);
            if (!taikoProfile) {
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

            const scoreDataMap: Record<string, SongScoreData> = {};
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

            await this.upload({
                UUID: this.current.UUID,
                scoreData: scoreDataMap,
                clearData,
                taikoProfile
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
            catch {
                token = await TokenManager.renewToken();
                retry++;
            }
        }
        return false;

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

    private async upload({ UUID, taikoProfile, scoreData, clearData }: { UUID: string; taikoProfile: TaikoProfile; scoreData: ScoreData; clearData: ClearData[] }) {
        //process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        await fetch('https://rating.taiko.wiki/api/internal/upload-rating-data', {
            method: 'POST',
            headers: {
                'x-internal-key': process.env.INTERNAL_API_KEY,
                'content-type': 'application/json'
            },
            body: LZUTF8.compress(JSON.stringify({
                UUID,
                taikoProfile,
                clearData,
                scoreData
            }), {outputEncoding: 'Base64'})
        })
    }
}

export namespace CrawlQueue {
    export type QueueElement = {
        taikoNo: string;
        UUID: string;
    }
}