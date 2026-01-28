import { CrawlQueue } from './module/CrawlQueue';
import { createDecipheriv } from 'node:crypto';
import { getUserDataByProviderAndProviderId } from './module/db';

const queue = new CrawlQueue();

Bun.serve({
    routes: {
        async '/request'(req) {
            if (req.method !== "POST") {
                return new Response(null, { status: 400 });
            }

            const data = await req.json();
            queue.push(data.UUID, data.taikoNo);

            return new Response(JSON.stringify(queue.database.db.query("SELECT * FROM queue_items").all()));
        },
        async '/position'(req){
            if (req.method !== "POST") {
                return new Response(null, { status: 400 });
            }

            const data = await req.json();

            return new Response(`${queue.getPosition(data.UUID)}`);
        }
    },
    port: 3000
});

async function checkUser(req: Bun.BunRequest) {
    const authCookie = req.cookies.get('auth-user');
    if (!authCookie) return null;

    try {
        const decrypted = decipher(authCookie, process.env.AUTH_KEY);
        var userData = JSON.parse(decrypted);
    }
    catch {
        return null;
    }

    // 만료기간 검사
    if ((userData.expiresIn as number) < Date.now()) {
        return null;
    }

    return getUserDataByProviderAndProviderId(userData.provider, userData.providerId);

    function decipher(encrypted: string, key: string) {
        const bufferKey = Buffer.from(key, 'hex');
        const decrypt = createDecipheriv('aes-256-gcm', bufferKey, bufferKey);
        return decrypt.update(encrypted, 'hex', 'utf-8');
    }
}