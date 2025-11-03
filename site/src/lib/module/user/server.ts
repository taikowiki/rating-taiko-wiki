import type { InferDBSchema } from "@yowza/db-handler/types";
import type { User } from ".";
import { wikiDBConnector, wikiQueryBuilder } from "../db/server";

export const userDBController = {
    getDataByProvider: wikiDBConnector.defineDBHandler<[provider: string, providerId: string], User.Data | null>((provider, providerId) => {
        return async (run) => {
            const rows = await wikiQueryBuilder
                .select('user/data', '*')
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
    for (const key in data) {
        if (key === "registerTimeStamp") continue;
        if (key === "providerUserData") {
            userData.providerUserData = JSON.parse(data[key] as string)
        }
        else {
            userData[key as keyof User.Data] = data[key] as any;
        }
    }

    return userData as Return;
}