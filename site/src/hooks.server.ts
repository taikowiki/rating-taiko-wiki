import { queryBuilder } from "$lib/module/db/server";
import { allowOrigin, authHook, internalApiHook, themeHook, userDataHook } from "$lib/module/hooks/server";
import { type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { runQuery } from "@yowza/db-handler";

export const handle: Handle = async ({ event, resolve }) => {
    const now = new Date();
    try {
        const s = sequence(
            authHook,
            userDataHook,
            themeHook,
            internalApiHook,
            allowOrigin('https://donderhiroba.jp', '/', { credentials: true }),
            allowOrigin('*', '/api/v1', { credentials: true })
        );
        const response = await s({ event, resolve });

        await runQuery(async (run) => {
            const query = queryBuilder.insert('log')
                .set(({ value }) => ({
                    time: value(now),
                    UUID: value(event.locals.userData?.UUID ?? null),
                    url: value(event.url.toString()),
                    status: value(response.status)
                }));
            await query.execute(run);
        });

        return response;
    }
    catch (err) {
        await runQuery(async (run) => {
            const query = queryBuilder.insert('log')
                .set(({ value }) => ({
                    time: value(now),
                    UUID: value(event.locals.userData?.UUID ?? null),
                    url: value(event.url.toString()),
                    status: value((err as any).status ?? 500),
                    error: value(`${err}`)
                }));
            await query.execute(run);
        });

        throw err;
    }
}