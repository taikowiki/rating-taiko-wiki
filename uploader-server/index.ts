import z from "zod";
import { CrawlQueue } from "./module/CrawlQueue";

const crawlQueue = new CrawlQueue();

Bun.serve({
    development: false,
    routes: {
        async '/'(request) {
            let requestData;
            try {
                requestData = z.object({
                    UUID: z.string(),
                    taikoNo: z.string()
                }).parse(await request.json())
            }
            catch {
                return new Response(null, { status: 400 });
            }
            crawlQueue.enqueue(requestData);
            return new Response();
        }
    }
})