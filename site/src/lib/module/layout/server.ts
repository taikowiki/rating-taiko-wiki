import type { RequestEvent } from "@sveltejs/kit";
import {UAParser} from "ua-parser-js";
import type { Util } from "../util";

export function getThemeCookie(event: RequestEvent): 'light' | 'dark' | undefined {
    const themeValue = event.cookies.get('theme');
    return themeValue as 'light' | 'dark' | undefined;
}

export function getIsMobileFromUA(event: RequestEvent): boolean | undefined {
    const userAgent = event.request.headers.get('user-agent');
    if (!userAgent) {
        return;
    }

    const isMobile = UAParser(userAgent).device.type === "mobile";
    return isMobile;
}

export function getLangCookie(event: RequestEvent): Util.LANG | undefined {
    const langValue = event.cookies.get('lang');
    return langValue as Util.LANG | undefined;
}