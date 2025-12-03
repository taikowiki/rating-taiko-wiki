import { measureDBController } from "$lib/module/measure/server";
import { fetchMeasures } from "@taiko-wiki/taiko-rating";

export async function GET() {
    const measures = await fetchMeasures();
    await measureDBController.update(measures);
    return new Response();
}