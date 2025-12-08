import { statisticsDBController } from "$lib/module/statistics/server";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { userDBController } from "$lib/module/user/server";
import { measureDBController } from "$lib/module/measure/server";

export async function load({ params, url, locals }: RequestEvent) {
    const songNo = params.songNo;
    const diff = url.searchParams.get('diff') as 'oni' | 'ura';
    if(!['oni', 'ura'].includes(diff ?? '')){
        throw error(404);
    }
    
    const measure = await measureDBController.getBySongNoAndDiff(songNo, diff);
    if(!measure){
        throw error(404)
    }

    const statisticData = (await statisticsDBController.getSongStatistic(songNo, diff)).toSorted((a, b) => b.songRatingData.ratingScore - a.songRatingData.ratingScore);

    let myData = null;
    if(locals.userData){
        myData = await userDBController.getSongRatingDataByUUID(locals.userData.UUID, songNo, diff);
    }

    return {
        statisticData,
        myData,
        measure
    }
}