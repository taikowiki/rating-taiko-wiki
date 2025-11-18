import { redirect } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { userDBController } from "$lib/module/user/server";

export async function load({ locals, url }: RequestEvent) {
    if (!locals.userData) {
        throw redirect(302, `https://taiko.wiki/auth/login?redirect_to=${encodeURIComponent(url.href)}`);
    }

    let profile = locals.profile;
    if (profile) {
        throw redirect(302, `/me`);
    }
    
    profile = {
        UUID: locals.userData.UUID,
        nickname: locals.userData.UUID,
        bio: ''
    }

    return {
        profile
    }
}