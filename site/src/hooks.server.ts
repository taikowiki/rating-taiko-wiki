import { authHook, userDataHook } from "$lib/module/hooks/server";
import { sequence } from "@sveltejs/kit/hooks";

export const handle = sequence(authHook, userDataHook);