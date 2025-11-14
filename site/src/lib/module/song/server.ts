import type { SongData } from "@taiko-wiki/taikowiki-api";
import { dbConverter, wikiDBConnector, type WikiDBSchema } from "../db/server";

export const songDBController = {
    getAllSongDatas: wikiDBConnector.defineDBHandler<[], SongData[]>(() => {
        return async (run) => {
            const rows = await run("SELECT * FROM `song`") as WikiDBSchema['song'][];
            return rows.map((row) => dbConverter.fromDB.song(row))
        }
    })
}