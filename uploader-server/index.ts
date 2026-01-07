import { CrawlQueue } from './module/CrawlQueue';

const queue = new CrawlQueue();

Bun.serve({
    routes: {
        async '/request'(req) {
            if (req.method !== "POST") {
                return new Response(null, { status: 400 });
            }

            const data = await req.json();
            queue.push(data.UUID, data.taikoNo);

            return new Response(JSON.stringify(queue.database.items));
        }
    },
    port: 3000
});
