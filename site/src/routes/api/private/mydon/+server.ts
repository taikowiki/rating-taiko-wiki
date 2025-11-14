import type { RequestEvent } from "./$types";

export async function GET({ url, fetch }: RequestEvent) {
    const taikoNo = url.searchParams.get('taikoNo') || "";

    return new Response((await fetch(`https://img.taiko-p.jp/imgsrc.php?v=&kind=mydon&fn=mydon_${encodeURIComponent(taikoNo)}`)).body)
}