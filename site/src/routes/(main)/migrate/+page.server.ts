import { error } from "console";
import type { RequestEvent } from "../$types";
import { userDBController, wikiUserDBController } from "$lib/module/user/server";

export async function load({ locals }: RequestEvent) {
    if (!locals.userData) {
        throw error(403);
    }
    const UUID = locals.userData.UUID

    const ratingDataExists = await userDBController.doesRatingDataExists(UUID);
    if (ratingDataExists) {
        return {
            canMigrate: false,
            reason: 'RATING_DATA_ALREADY_EXISTS'
        }
    }

    const donderData = await wikiUserDBController.getDonderData(UUID);
    if (!donderData) {
        return {
            canMigrate: false,
            reason: 'DONDER_DATA_NOT_EXISTS'
        }
    }
    if (!donderData.scoreData) {
        return {
            canMigrate: false,
            reason: 'SCORE_DATA_NOT_EXISTS'
        }
    }
    if (!donderData.ratingData || typeof (donderData.currentRating) !== "number" || typeof (donderData.currentExp) !== "number") {
        return {
            canMigrate: false,
            reason: `RATING_DATA_NOT_EXISTS`
        }
    }

    return {
        canMigrate: true
    }
}