import { migrateRatingData } from '$lib/module/user/server.js';
import { error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export async function GET({ locals }: RequestEvent) {
    if (!locals.userData) {
        throw error(403);
    }

    const result = await migrateRatingData(locals.userData?.UUID);
    if (result.success) {
        return new Response();
    }
    throw error(500, {
        message: '',
        reason: result.reason
    })
}