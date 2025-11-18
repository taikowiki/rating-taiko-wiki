import { userDBController } from "$lib/module/user/server";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function load({params}: RequestEvent){
    const page = Number(params.p);
    if(Number.isNaN(page) || !Number.isInteger(page) || page < 1){
        throw error(404);
    }

    return {
        rankingData: await userDBController.getRankingData(Number(params.p)),
        page
    }
}