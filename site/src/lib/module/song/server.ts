import type { SongData } from "@taiko-wiki/taikowiki-api";
import { dbConverter, wikiDBConnector, wikiQueryBuilder, type WikiDBSchema } from "../db/server";

export namespace songDBController {
    export const getAllSongDatas = wikiDBConnector.defineDBHandler<[], SongData[]>(() => {
        return async (run) => {
            const rows = await run("SELECT * FROM `song`") as WikiDBSchema['song'][];
            return rows.map((row) => dbConverter.fromDB.song(row))
        }
    });

    export const getAllTitles = wikiDBConnector.defineDBHandler<[], Pick<SongData, 'songNo' |'title' | 'titleEn' | 'titleKo' | 'aliasEn' | 'aliasKo' | 'romaji'>[]>(() => {
        const query = wikiQueryBuilder.select('song', () => ({
            songNo: 'songNo',
            title: 'title',
            titleEn: 'titleEn',
            titleKo: 'titleKo',
            aliasEn: 'aliasEn',
            aliasKo: 'aliasKo',
            romaji: 'romaji'
        }));
        return async (run) => {
            const rows = await query.execute(run);
            return rows.map((row) => dbConverter.fromDB.song(row))
        }
    });
}