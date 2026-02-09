import { userDBController } from '$lib/module/user/server.js';
import { error } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    if (!locals.userData) {
        throw error(401);
    }

    const data = await request.json();

    if (data?.agree !== true) {
        throw error(400);
    }

    await userDBController.deleteData(locals.userData.UUID);

    return new Response();
}