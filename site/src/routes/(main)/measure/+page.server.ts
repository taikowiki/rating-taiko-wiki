import { measureDBController } from "$lib/module/measure/server";
import { songDBController } from "$lib/module/song/server";
import type { SongData } from "@taiko-wiki/taikowiki-api";

export async function load() {
    const measures = await measureDBController.getAll();
    measures.sort((a, b) => (b.measureValue - a.measureValue) || (a.index - b.index));
    const songTitles = await songDBController.getAllTitles();
    const songTitleMap: Record<string, Pick<SongData, 'songNo' | 'title' | 'titleEn' | 'titleKo' | 'aliasEn' | 'aliasKo' | 'romaji'>> = {};
    songTitles.forEach((s) => {
        songTitleMap[s.songNo] = s;
    })
    return {
        measures,
        songTitleMap
    }
}