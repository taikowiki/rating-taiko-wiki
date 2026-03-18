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
     * 서버 재시작 시 working이었던 아이템들을 wating으로 복구
     */
    resetWorkingItems() {
        this.db.run("UPDATE queue_items SET status = 'wating' WHERE status = 'working'");
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
     * 최근 성공한 업로드 시간 가져오기
     */
    getLastSuccessTime(UUID: string) {
        const query = this.db.query<QueueDBRow, [string]>("SELECT * FROM queue_items WHERE uuid = ? AND status = 'success' ORDER BY updated_time DESC LIMIT 1");
        const row = query.get(UUID);
        return row ? row.updated_time : null;
    }

    /**
     * UUID에 해당하는 아이템의 대기 순번 가져오기
     * - 작업 중: 0
     * - 대기 중: 1 이상
     * - 큐에 없음: null
     */
    getPosition(UUID: string) {
        // 1. 현재 작업 중인 아이템인지 확인
        const workingItem = this.db.query<QueueDBRow, []>("SELECT * FROM queue_items WHERE status = 'working'").get();
        if (workingItem && workingItem.uuid === UUID) {
            return 0;
        }

        // 2. 대기 중인 내 아이템의 order 가져오기
        const targetRow = this.db.query<Pick<QueueDBRow, 'order'>, [string]>("SELECT `order` FROM queue_items WHERE uuid = ? AND status = 'wating' LIMIT 1").get(UUID);
        
        // 큐에 없음
        if (!targetRow) {
            return null;
        }

        // 3. 내 앞에 몇 명이 있는지 계산 (working 포함)
        const query = this.db.query<{ count: number }, [number]>("SELECT COUNT(*) AS `count` FROM queue_items WHERE status IN ('wating', 'working') AND `order` < ?");
        const countRow = query.get(targetRow.order);
        
        return (countRow?.count ?? 0) + (workingItem ? 0 : 0); // working이 있으면 이미 count에 포함됨
    }

    /**
     * 현재 큐에 있는 전체 인원 수 (working + wating)
     */
    getTotalQueueCount() {
        const query = this.db.query<{ count: number }, []>("SELECT COUNT(*) AS `count` FROM queue_items WHERE status IN ('wating', 'working')");
        const row = query.get();
        return row?.count ?? 0;
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
    onUpdate?: () => void;

    private log(message: string) {
        console.log(`[${new Date().toLocaleTimeString()}] [Queue] ${message}`);
    }

    private error(message: string, err?: any) {
        if (err) {
            console.error(`[${new Date().toLocaleTimeString()}] [Queue] ${message}`, err);
        } else {
            console.error(`[${new Date().toLocaleTimeString()}] [Queue] ${message}`);
        }
    }

    push(UUID: string, taikoNo: string): boolean {
        const UUIDDuplicated = this.database.hasDuplicateUUID(UUID);
        if (UUIDDuplicated) {
            return false;
        }

        this.database.push(UUID, taikoNo);
        this.onUpdate?.();
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

        this.log(`Processing order #${item.order} (TaikoNo: ${item.taikoNo})`);
        this.database.changeStatus(item.order, 'working');
        this.onUpdate?.();

        try {
            const crawledData = await this.crawler.crawl(item.taikoNo);
            if (!crawledData) {
                throw new Error("Crawling error.");
            }
            this.log(`Uploading data for ${item.taikoNo}...`);
            await this.uploader.upload({
                UUID: item.UUID,
                ...crawledData
            });
            this.database.changeStatus(item.order, 'success');
        }
        catch (err) {
            this.error(`Error processing order #${item.order}:`, err);
            this.database.changeStatus(item.order, 'error');
        }
        this.onUpdate?.();
        this.queueRunning = false;
        setImmediate(() => this.run());
    }
}