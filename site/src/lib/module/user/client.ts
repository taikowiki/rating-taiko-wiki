export namespace userRequestor {
    export async function migrate() {
        const response = await fetch('/api/v1/rating/migrate');

        const data = await response.json().catch(() => ({}));

        if (200 <= response.status && response.status < 300) {
            return {
                status: 'success',
                data
            }
        }
        else {
            return {
                status: 'error',
                reason: data.reason as string | undefined
            }
        }
    }
}