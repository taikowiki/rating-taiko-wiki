import { redirect } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { userDBController, wikiUserDBController } from "$lib/module/user/server";

export async function GET({ locals }: RequestEvent) {
    if (!locals.userData) {
        throw redirect(302, `https://taiko.wiki/auth/login?redirect_to=${encodeURIComponent('https://rating.taiko.wiki/myrating')}`);
    }
    
    throw redirect(302, `/user/${locals.userData.UUID}`);
}