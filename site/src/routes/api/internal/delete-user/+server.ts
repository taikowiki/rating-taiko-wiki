import { userDBController } from "$lib/module/user/server";
import type { RequestEvent } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import z from "zod";

export async function POST({ request }: RequestEvent) {
    let requestData: { UUID: string };
    try {
        requestData = z.object({
            UUID: z.string()
        }).parse(await request.json());
    }
    catch {
        throw error(400);
    }

    await userDBController.deleteData(requestData.UUID);

    return new Response();
}