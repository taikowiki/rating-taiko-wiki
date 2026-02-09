import type { User } from ".";
import type { RequestResult } from "../util/client";

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

    export async function updateProfile(profile: User.Profile & { option?: User.ProfileOption }): Promise<RequestResult<void>> {
        const response = await fetch('/api/private/profile', {
            method: 'post',
            body: JSON.stringify(profile)
        });

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

    export async function deleteData(): Promise<RequestResult<void>> {
        const response = await fetch('/api/private/profile', {
            method: 'post',
            body: JSON.stringify({
                agree: true
            })
        });

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