import type { Handle } from "@sveltejs/kit";
import { userDBController } from "../user/server";
import auth from "@sveltekit-board/oauth";
import { AUTH_KEY } from "$env/static/private";
import { wikiDBConnector } from "../db/server";

/**
 * 특정 Origin에서의 요청 허용
 */
export function allowOrigin(allowedOrigin: string, allowedPath: string, option?: AllowOriginOption) {
    const handle: Handle = async ({ event, resolve }) => {
        const origin = event.request.headers.get('Origin');
        if (!origin) return await resolve(event);

        if ((allowedOrigin === "*" || origin === allowedOrigin) && event.url.pathname.startsWith(allowedPath)) {
            event.setHeaders({
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
            })
            if (option) {
                if (option?.credentials === true) {
                    event.setHeaders({
                        "Access-Control-Allow-Credentials": "true"
                    })
                }
            }
            if (event.request.method === "OPTIONS") {
                return new Response(null, {
                    status: 204
                });
            }
        }

        return await resolve(event);
    }
    return handle;
};

export const authHook = auth([], {
    key: AUTH_KEY,
    maxAge: 3600 * 24 * 7,
    autoRefreshMaxAge: true,
    withCredentials: true
});

/**
 * Provider와 providerId에 대해 유저 데이터 가져오기
 */
export const userDataHook: Handle = async ({ event, resolve }) => {
    if (event.locals.user) {
        let userData = await userDBController.getDataByProvider(event.locals.user.provider, event.locals.user.providerId);
        event.locals.userData = userData;
    }
    else {
        event.locals.userData = null;
    }

    return await resolve(event);
}

export interface AllowOriginOption {
    credentials?: boolean
}