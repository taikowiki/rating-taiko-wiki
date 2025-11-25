import { userDBController, wikiUserDBController } from '$lib/module/user/server.js';
import { error, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export async function load({ params, locals }: RequestEvent) {
    const UUID = params.UUID;

    const profile = await userDBController.getProfile(UUID);
    if (!profile) throw await redirectWhenDataNotExists();
    const taikoProfile = await userDBController.getTaikoProfile(UUID);
    if (!taikoProfile) throw await redirectWhenDataNotExists();
    const ratingData = await userDBController.getRatingData(UUID);
    if (!ratingData) throw await redirectWhenDataNotExists();

    const profileOption = await userDBController.getProfileOption(UUID);
    if(profileOption?.hideDan && 
        (locals.userData ? 
            (locals.userData.grade < 10 && locals.userData.UUID !== UUID): true
        )
    ){
        taikoProfile.dani = null;
    }

    return {
        taikoProfile,
        profile,
        ratingData
    }

    async function redirectWhenDataNotExists() {
        if (!locals.userData || locals.userData.UUID !== UUID) {
            return error(404)
        }

        const { canMigrate } = await testMigrate(UUID);
        if (canMigrate) {
            return redirect(302, '/migrate');
        }

        return redirect(302, '/docs/upload');
    }
}

async function testMigrate(UUID: string) {
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