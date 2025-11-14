import type { InferDBSchema } from "@yowza/db-handler/types";
import type { User } from ".";
import { wikiDBConnector, wikiQueryBuilder } from "../db/server";

export const userDBController = {
    getDataByProvider: wikiDBConnector.defineDBHandler<[provider: string, providerId: string], User.Data | null>((provider, providerId) => {
        return async (run) => {
            const rows = await wikiQueryBuilder
                .select('user/data', () => ({ provider: 'provider', providerId: 'providerId', UUID: 'UUID', lang: 'lang' }))
                .where(({ compare, column, value }) => [
                    compare(column('provider'), '=', value(provider)),
                    compare(column('providerId'), '=', value(providerId))
                ])
                .execute(run);

            if (rows.length !== 0) {
                return parseUserData(rows[0]);
            }

            return null;
        }
    })
}

function parseUserData<const T extends Partial<InferDBSchema<typeof wikiQueryBuilder.dbSchema>['user/data']>>(data: T) {
    type Return = T extends Partial<InferDBSchema<typeof wikiQueryBuilder.dbSchema>['user/data']> ? Pick<User.Data, Extract<keyof T, keyof User.Data>> : never;

    const userData: Partial<User.Data> = {};
    if (data.UUID) {
        userData.UUID = data.UUID;
    }
    if (data.provider) {
        userData.provider = data.provider;
    }
    if (data.providerId) {
        userData.providerId = data.providerId;
    }
    if (data.lang) {
        userData.lang = data.lang;
    }

    return userData as Return;
}