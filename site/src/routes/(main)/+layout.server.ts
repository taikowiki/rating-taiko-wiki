import { getIsMobileFromUA, getThemeCookie } from "$lib/module/layout/server";
import type { RequestEvent } from "./$types";

export async function load(event: RequestEvent) {
    const theme = getThemeCookie(event);
    const isMobile = getIsMobileFromUA(event);

    return {
        theme,
        isMobile
    }
}