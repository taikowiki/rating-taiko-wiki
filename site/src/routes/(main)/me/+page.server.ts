import { redirect } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { userDBController } from "$lib/module/user/server";

export async function load({ locals }: RequestEvent) {
    if (!locals.userData) {
        throw redirect(302, `https://taiko.wiki/auth/login?redirect_to=${encodeURIComponent('https://rating.taiko.wiki/me')}`);
    }

    let profile = await userDBController.getProfile(locals.userData.UUID);
    if (!profile) {
        profile = {
            UUID: locals.userData.UUID,
            nickname: locals.userData.UUID,
            bio: ''
        }
    }

    const profileOption = await userDBController.getProfileOption(locals.userData.UUID);

    const taikoProfile = await userDBController.getTaikoProfile(locals.userData.UUID);

    return {
        profile,
        taikoProfile,
        profileOption
    }
}