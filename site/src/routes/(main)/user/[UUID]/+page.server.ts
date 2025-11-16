import type { User } from '$lib/module/user/index.js';
import { userDBController } from '$lib/module/user/server.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const UUID = params.UUID;

    const profile = await userDBController.getProfile(UUID);
    if(!profile) throw error(404);
    const taikoProfile = await userDBController.getTaikoProfile(UUID);
    if (!taikoProfile) throw error(404);
    const ratingData = await userDBController.getRatingData(UUID);
    if (!ratingData) throw error(404);

    return {
        taikoProfile,
        profile,
        ratingData
    }
}