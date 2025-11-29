import { User } from "$lib/module/user";
import { updateRatingData } from "$lib/module/user/server";
import { error, type RequestEvent } from "@sveltejs/kit";
import LZUTF8 from "lzutf8";
import z from "zod";

export async function POST(event: RequestEvent) {
    if (!event.locals.userData) {
        throw error(403);
    }
    const UUID = event.locals.userData.UUID;

    /* 요청 데이터 검사 */
    let requestData: { taikoProfile: User.TaikoProfile, scoreData?: User.ScoreData, clearData?: User.ClearData[] };
    try {
        const requestText = await event.request.text();
        requestData = JSON.parse(LZUTF8.decompress(requestText, { inputEncoding: 'Base64' }));
        z.object({
            taikoProfile: User.Schema.TaikoProfile,
            scoreData: z.optional(User.Schema.ScoreData),
            clearData: z.optional(z.array(User.Schema.ClearData))
        })
            .parse(requestData);
    }
    catch (err) {
        console.error(err);
        throw error(400);
    }

    const currentRatingScore = await updateRatingData({
        ...requestData,
        UUID
    });

    return new Response(JSON.stringify({
        currentRatingScore
    }));
}