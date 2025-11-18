import { redirect } from "@sveltejs/kit";

export async function GET(){
    throw redirect(302, '/ranking/1');
}