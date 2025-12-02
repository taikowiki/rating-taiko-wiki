import { userDBController } from '$lib/module/user/server.js';

export async function load({ locals }) {
    if (!locals.userData) return;

    const myRatingData = await userDBController.getRatingData(locals.userData.UUID);
    if (!myRatingData) return;
    const myTaikoProfiile = await userDBController.getTaikoProfile(locals.userData.UUID);
    if (!myTaikoProfiile) return;

    return {
        myRatingData,
        myTaikoProfiile
    }
}