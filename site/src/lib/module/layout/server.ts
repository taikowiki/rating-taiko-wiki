import type { RequestEvent } from "@sveltejs/kit";
import { UAParser } from "ua-parser-js";
import type { I18n } from "../i18n";

export function getThemeCookie(event: RequestEvent): 'light' | 'dark' | undefined {
    const themeValue = event.cookies.get('theme');
    return themeValue as 'light' | 'dark' | undefined;
}

export function getIsMobileCookie(event: RequestEvent): boolean | undefined {
    const isMobileCookie = event.cookies.get('isMobile');
    if(isMobileCookie === "true") return true;
    else if(isMobileCookie === "false") return false;
}
export function getIsMobileFromUA(event: RequestEvent): boolean | undefined {
    const userAgent = event.request.headers.get('user-agent');
    if (!userAgent) {
        return;
    }

    const isMobile = UAParser(userAgent).device.type === "mobile";
    return isMobile;
}

export function getLangCookie(event: RequestEvent): I18n.Lang | undefined {
    const langValue = event.cookies.get('lang');
    return langValue as I18n.Lang | undefined;
}