import { getIsMobileCookie, getIsMobileFromUA, getLangCookie, getThemeCookie } from "$lib/module/layout/server";
import { redirect } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function load(event: RequestEvent) {
    const theme = getThemeCookie(event);
    const lang = getLangCookie(event);
    const isMobile = getIsMobileCookie(event) ?? getIsMobileFromUA(event);

    if (event.url.pathname !== "/start" && event.locals.userData && !event.locals.profile) {
        throw redirect(302, '/start');
    }

    return {
        theme,
        lang,
        isMobile,
        timezone: process.env.TIMEZONE,
        user: event.locals.userData ? {
            UUID: event.locals.userData.UUID,
            profile: event.locals.profile
        } : null
    }
}