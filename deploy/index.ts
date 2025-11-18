import { execSync } from "child_process";
import { copyFileSync } from "fs";
import { join } from "path";

Bun.serve({
    routes: {
        '/': async (request) => {
            const tag = await request.json().then(({ tag }) => tag);
            if (!tag) {
                return new Response(null, { status: 400 });
            }

            const internalApiKey = request.headers.get('x-internal-key');
            if (!internalApiKey) {
                return new Response(null, { status: 401 });
            }
            if (internalApiKey !== process.env.INTERNAL_API_KEY) {
                return new Response(null, { status: 403 });
            }

            const dir = `/home/ubuntu/server/rating/build/${tag}`;

            await Bun.write(
                join(dir, 'build.zip'),
                await fetch(`https://github.com/taikowiki/rating-taiko-wiki/releases/download/${tag}/build.zip`),
                {
                    createPath: true
                }
            );

            execSync(`unzip "${join(dir, 'build.zip')}" -d "${dir}"`);
            execSync(`bun i`, { cwd: dir });
            copyFileSync(join(process.cwd(), '.prod.env'), join(dir, '.env'));

            try {
                execSync('sudo pm2 delete rating');
            }
            catch { }

            execSync('sudo pm2 start build --name rating --interpreter bun', { cwd: dir });

            return new Response();
        }
    },
    port: 3001
})