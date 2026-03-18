import { CrawlQueue } from './module/CrawlQueue';
import { createDecipheriv } from 'node:crypto';
import ndJson from 'ndjson-parser';
import { BunRequest } from 'bun';

const queue = new CrawlQueue();

// 서버 시작 시 기존 작업 복구 및 실행
queue.database.resetWorkingItems();
queue.run();

const server = Bun.serve<{ user: any }>({
    routes: {
        async '/'(req: BunRequest) {
            return new Response(Bun.file('public/index.html'));
        },
        async '/request'(req: BunRequest) {
            if (req.method !== "POST") {
                return new Response(null, { status: 400 });
            }

            const user = await checkUser(req);
            if (!user) {
                return new Response(null, { status: 401 });
            }

            const pushed = queue.push(user.UUID, user.taikoNumber);

            if (pushed) {
                return new Response(JSON.stringify({
                    authenticated: true,
                    position: queue.getPosition(user.UUID),
                    totalQueueCount: queue.database.getTotalQueueCount(),
                    lastSuccessTime: queue.database.getLastSuccessTime(user.UUID)
                }));
            }
            else {
                return new Response(null, { status: 409 });
            }
        },
        async '/position'(req: BunRequest) {
            if (req.method !== "POST") {
                return new Response(null, { status: 400 });
            }

            const user = await checkUser(req);
            
            return new Response(JSON.stringify({
                authenticated: !!user,
                position: user ? queue.getPosition(user.UUID) : null,
                totalQueueCount: queue.database.getTotalQueueCount(),
                lastSuccessTime: user ? queue.database.getLastSuccessTime(user.UUID) : null
            }));
        },
        async '/ws'(req: BunRequest, server: Bun.Server<{user: any}>) {
            const user = await checkUser(req);
            const success = server.upgrade(req, {
                data: { user }
            });
            return success ? undefined : new Response("WebSocket upgrade failed", { status: 400 });
        }
    },
    websocket: {
        open(ws) {
            ws.subscribe("global");
            if (ws.data.user) {
                ws.subscribe(`user:${ws.data.user.UUID}`);
            }
            // 초기 데이터 전송
            ws.send(JSON.stringify({
                type: 'update',
                authenticated: !!ws.data.user,
                totalQueueCount: queue.database.getTotalQueueCount(),
                position: ws.data.user ? queue.getPosition(ws.data.user.UUID) : null,
                lastSuccessTime: ws.data.user ? queue.database.getLastSuccessTime(ws.data.user.UUID) : null
            }));
        },
        message(ws, message) {
            // 메시지 처리 로직이 필요하면 여기에 작성
        },
        close(ws) {
            ws.unsubscribe("global");
            if (ws.data.user) {
                ws.unsubscribe(`user:${ws.data.user.UUID}`);
            }
        }
    },
    port: process.env.PORT
});

// 큐 상태 변경 시 브로드캐스트
queue.onUpdate = () => {
    // 모든 클라이언트에게 전체 대기자 수 전송
    server.publish("global", JSON.stringify({
        type: 'totalUpdate',
        totalQueueCount: queue.database.getTotalQueueCount()
    }));

    // 모든 접속된 사용자에게 개별 순번 업데이트 트리거 (또는 전체 구독자에게 알림)
    // 여기서는 간단하게 모든 클라이언트가 자기 정보를 갱신하도록 'refresh' 메시지를 보낼 수도 있지만,
    // 더 정교하게 하려면 구독자 리스트를 관리하며 UUID별로 publish 해야 합니다.
    // 여기서는 모든 클라이언트에게 자기 정보를 다시 확인하라는 신호를 보냅니다.
    server.publish("global", JSON.stringify({ type: 'refreshRequest' }));
};

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

    const dbmasterUrl = new URL(process.env.DBMASTER_URL);
    dbmasterUrl.pathname = "/func"

    let res = await fetch(dbmasterUrl, {
        method: 'post',
        body: JSON.stringify({
            name: 'user.user-data',
            params: {
                provider: userData.provider,
                providerId: userData.providerId
            }
        }),
        headers: {
            'x-api-key': process.env.DBMASTER_KEY
        }
    });

    if (200 <= res.status && res.status < 300) {
        var user = ndJson.parse(await res.text())[0];
        if(!user){
            return null;
        }
    }
    else {
        return null;
    }

    res = await fetch(dbmasterUrl, {
        method: 'post',
        body: JSON.stringify({
            name: 'rating.simple-profile',
            params: {
                uuid: user.UUID
            }
        }),
        headers: {
            'x-api-key': process.env.DBMASTER_KEY
        }
    });

    if (200 <= res.status && res.status < 300) {
        const resData = ndJson.parse(await res.text())[0];
        return resData ?? null;
    }
    else {
        return null;
    }

    function decipher(encrypted: string, key: string) {
        const bufferKey = Buffer.from(key, 'hex');
        const decrypt = createDecipheriv('aes-256-gcm', bufferKey, bufferKey);
        return decrypt.update(encrypted, 'hex', 'utf-8');
    }
}