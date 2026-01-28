import { Crawler } from "./Crawler";
import { Uploader } from "./Uploader";
import { Database } from 'bun:sqlite';

type QueueItem = {
    order: number;
    UUID: string;
    taikoNo: string;
    status: 'wating' | 'working' | 'success' | 'error';
    createdTime: Date;
    updatedTime: Date;
}
type QueueDBRow = {
    order: number;
    uuid: string;
    taiko_no: string;
    status: 'wating' | 'working' | 'success' | 'error';
    created_time: number;
    updated_time: number;
}

class QueueItemDatabase {
    static query = {
        createTable: `
        CREATE TABLE IF NOT EXISTS queue_items (
            "order" INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            taiko_no TEXT NOT NULL,
            status TEXT NOT NULL
                CHECK (status IN ('wating', 'working', 'success', 'error')),
            created_time INTEGER NOT NULL,
            updated_time INTEGER NOT NULL
        );`
    }

    db = new Database('./queue.db');
    constructor() {
        this.db.run(QueueItemDatabase.query.createTable)
    }

    /**
     * 아이템 추가
     */
    push(UUID: string, taikoNo: string) {
        const now = Date.now()
        this.db.run("INSERT INTO queue_items (uuid, taiko_no, status, created_time, updated_time) VALUES (?, ?, ?, ?, ?)", [UUID, taikoNo, 'wating', now, now])
    }

    /**
     * wating 아이템 가져오기
     */
    peek(): QueueItem | null {
        const query = this.db.query<QueueDBRow, []>("SELECT * FROM queue_items WHERE status = 'wating' ORDER BY `order` ASC LIMIT 1")
        const row = query.get()

        if (row) {
            return this.rowToQueueItem(row);
        }
        else {
            return null;
        }
    }

    /**
     * 완료되지 않은 아이템 중 UUID가 중복되는 게 있는 지 확인
     */
    hasDuplicateUUID(UUID: string) {
        const query = this.db.query<QueueDBRow, [string]>("SELECT * FROM queue_items WHERE uuid = ? AND (status = 'wating' OR status = 'working')")
        const row = query.get(UUID)
        if (row) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * 아이템의 상태를 변경
     */
    changeStatus(order: number, status: QueueItem['status']) {
        this.db.run("UPDATE queue_items SET status = ?, updated_time = ? WHERE `order` = ?", [status, Date.now(), order])
    }

    /**
     * status가 'working'인 아이템 가져오기
     */
    getWorkingItem() {
        const query = this.db.query<QueueDBRow, []>("SELECT * FROM queue_items WHERE status = 'working'");
        const row = query.get()

        if (row) {
            return this.rowToQueueItem(row)
        }
        else {
            return null;
        }
    }

    /**
     * UUID에 해당하는 아이템의 status가 'waiting'이면 대기 순번 가져오기
     */
    getPosition(UUID: string) {
        const query = this.db.query<{ count: number }, [string]>(`
        SELECT COUNT(*) AS \`count\`
            FROM queue_items
            WHERE 
                status IN ('wating', 'working')
                AND \`order\` < (
                    SELECT \`order\`
                    FROM queue_items
                    WHERE 
                        uuid = ?
                        AND status = 'wating'
                    LIMIT 1
                );
        `);
        const countRow = query.get(UUID)
        if (!countRow) return null;
        if (countRow.count === 0) return null;
        return countRow.count;

        /*
        const targetQuery = this.db.query<Pick<QueueDBRow, 'order'>, [string]>("SELECT `order` FROM queue_items WHERE uuid = ? AND status = 'wating'");
        const targetRow = targetQuery.get(UUID);
        if (!targetRow) {
            return null;
        }

        const query = this.db.query<{ count: number }, [number]>("SELECT COUNT(*) as `count` FROM queue_items WHERE order < ? AND (status = 'wating' OR status = 'working)");
        const countRow = query.get(targetRow.order);
        return countRow?.count ?? null;
        */
    }

    rowToQueueItem(row: QueueDBRow): QueueItem {
        return {
            order: row.order,
            UUID: row.uuid,
            taikoNo: row.taiko_no,
            status: row.status,
            createdTime: new Date(row.created_time),
            updatedTime: new Date(row.updated_time)
        }
    }
}

export class CrawlQueue {
    database = new QueueItemDatabase();
    crawler = new Crawler();
    uploader = new Uploader();
    queueRunning: boolean = false;

    push(UUID: string, taikoNo: string): boolean {
        const UUIDDuplicated = this.database.hasDuplicateUUID(UUID);
        if (UUIDDuplicated) {
            return false;
        }

        this.database.push(UUID, taikoNo);
        if (this.queueRunning) {
            return true;
        }
        setImmediate(() => this.run());
        return true;
    }

    getPosition(UUID: string) {
        return this.database.getPosition(UUID);
    }

    async run() {
        if (this.queueRunning) return;
        this.queueRunning = true;

        const item = this.database.peek();
        if (!item) {
            this.queueRunning = false;
            return;
        }

        this.database.changeStatus(item.order, 'working');

        try {
            const crawledData = await this.crawler.crawl(item.taikoNo);
            if (!crawledData) {
                throw new Error("Crawling error.");
            }
            await this.uploader.upload({
                UUID: item.UUID,
                ...crawledData
            });
            this.database.changeStatus(item.order, 'success');
        }
        catch (err) {
            console.error(err);
            this.database.changeStatus(item.order, 'error');
        }
        this.queueRunning = false;
        setImmediate(() => this.run());
    }
}