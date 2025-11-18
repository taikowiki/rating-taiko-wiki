import { error, type RequestEvent } from "@sveltejs/kit";
import { User } from "$lib/module/user";
import { userDBController } from "$lib/module/user/server";
import z from "zod";

/**
 * 
 * @reason `INVALID_REQUEST_DATA` 잘못된 형식의 요청 데이터
 */
export async function POST({ locals, request }: RequestEvent) {
    if (!locals.userData) throw error(403);

    const UUID = locals.userData.UUID;

    let requestData: { profile: User.Profile; agree: boolean };
    try {
        requestData = await request.json();
        z.object({
            profile: User.Schema.Profile,
            agree: z.boolean()
        }).parse(requestData);
    }
    catch (err) {
        throw error(400, {
            message: "",
            reason: "INVALID_REQUEST_DATA"
        })
    }

    if (!requestData.agree) {
        throw error(400, {
            message: "",
            reason: "NOT_AGREED"
        });
    }

    requestData.profile.nickname = requestData.profile.nickname.slice(0, 20);

    await userDBController.updateProfile(UUID, requestData.profile);
    return new Response();
}