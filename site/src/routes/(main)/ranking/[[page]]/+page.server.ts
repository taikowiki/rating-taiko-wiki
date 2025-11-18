import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { userDBController } from "$lib/module/user/server";

export async function load({ params }: RequestEvent) {
    const page = Number(params.page ?? '1');
    if (!Number.isInteger(page) || page < 1) {
        throw error(400);
    }

    const rankingData = await userDBController.getRankingData(page);
    return {
        rankingData,
        page
    }
}