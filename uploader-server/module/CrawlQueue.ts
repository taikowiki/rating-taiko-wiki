import { Crawler } from "./Crawler";
import { Uploader } from "./Uploader";

type QueueItem = {
    order: number;
    UUID: string;
    taikoNo: string;
    status: 'wating' | 'working' | 'success' | 'error';
}

/**
 * @todo status가 'working'인 아이템 가져오기
 * @todo 만약 특정 UUID를 가진 아이템이 status가 'wating'이면 몇번째 순위인지 가져오기
 */
class QueueItemDatabase {
    currentOrder = 0;
    items: QueueItem[] = [];

    /**
     * 아이템 추가
     */
    push(UUID: string, taikoNo: string) {
        this.currentOrder++;
        this.items.push({
            order: this.currentOrder,
            UUID,
            taikoNo,
            status: 'wating'
        });
    }

    /**
     * wating 아이템 가져오기
     */
    pop() {
        for (const item of this.items) {
            if (item.status === 'wating') return item;
        }
        return null;
    }

    /**
     * 완료되지 않은 아이템 중 UUID가 중복되는 게 있는 지 확인
     */
    hasDuplicateUUID(UUID: string) {
        for (const item of this.items) {
            if (item.UUID === UUID && (item.status === 'wating' || item.status === 'working')) {
                return true;
            }
        }
        return false;
    }

    /**
     * 아이템의 상태를 변경
     */
    changeStatus(order: number, status: QueueItem['status']) {
        for (const item of this.items) {
            if (item.order === order) {
                item.status = status;
                return;
            }
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

    async run() {
        if (this.queueRunning) return;
        this.queueRunning = true;

        const item = this.database.pop();
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