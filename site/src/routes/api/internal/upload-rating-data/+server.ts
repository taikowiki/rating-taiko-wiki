import { User } from "$lib/module/user";
import { updateRatingData, userDBController } from "$lib/module/user/server";
import type { RequestEvent } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import LZUTF8 from "lzutf8";
import z from "zod";

export async function POST({ request }: RequestEvent) {
    let requestData;
    try {
        requestData = z.object({
            UUID: z.string(),
            taikoProfile: User.Schema.TaikoProfile,
            scoreData: User.Schema.ScoreData,
            clearData: z.array(User.Schema.ClearData)
        }).parse(JSON.parse(LZUTF8.decompress(await request.text(), { inputEncoding: 'Base64' })));
    }
    catch (err){
        console.error(err);
        throw error(400);
    }

    try{
        await updateRatingData(requestData);
    }
    catch(err){
        console.error(err);
    }

    return new Response();
}