import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { User } from "$lib/module/user";
import { userDBController } from "$lib/module/user/server";

/**
 * 
 * @reason `INVALID_REQUEST_DATA` 잘못된 형식의 요청 데이터
 */
export async function POST({locals, request}: RequestEvent){
    if(!locals.userData) throw error(403);

    const UUID = locals.userData.UUID;

    let requestData: User.Profile;
    try{
        requestData = await request.json();
        User.Schema.Profile.parse(requestData);
    }
    catch(err){
        throw error(400, {
            message: "",
            reason: "INVALID_REQUEST_DATA"
        })
    }

    requestData.nickname = requestData.nickname.slice(0, 20);

    await userDBController.updateProfile(UUID, requestData);
    return new Response();
}