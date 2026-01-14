import { defineDBHandler, QueryBuilder } from "@yowza/db-handler";
import { InferDBSchema } from "@yowza/db-handler/types";

export const queryBuilder = new QueryBuilder({
    'ban/auth': {
        id: ['number'],
        provider: ['string'],
        providerId: ['string']
    },
    'ban/ip': {
        order: ['number'],
        time: ['date'],
        ip: ['string']
    },
    'user/data': {
        order: ['number'],
        provider: ['string'],
        providerId: ['string'],
        nickname: ['string'],
        UUID: ['string'],
        grade: ['number'],
        registerTime: ['number'],
        registerTimeStamp: ['date'],
        providerUserData: ['string', 'null'],
        lang: ['string'],
        showRatingNickname: ['number'],
        showRatingTaikoNo: ['number'],
        showRatingSongs: ['number']
    }
});

interface UserData {
    order: number;
    provider: string;
    providerId: string;
    UUID: string;
    nickname: string;
    registerTime: number;
    grade: number;
    providerUserData: Object | null;
    lang: string;
    showRatingNickname: 0 | 1;
    showRatingTaikoNo: 0 | 1;
    showRatingSongs: 0 | 1;
}
export const getUserDataByProviderAndProviderId = defineDBHandler<[string, string], UserData | null>((provider, providerId) => {
    return async (run) => {
        const rows = await queryBuilder
            .select('user/data', '*')
            .where(({ compare, column, value }) => [
                compare(column('provider'), '=', value(provider)),
                compare(column('providerId'), '=', value(providerId))
            ])
            .execute(run);

        if (rows.length !== 0) {
            // 유저 존재
            return parseUserData(rows[0]);
        }

        return null;
    }

    function parseUserData<const T extends Partial<InferDBSchema<typeof queryBuilder.dbSchema>['user/data']>>(data: T) {
        type Return = T extends Partial<InferDBSchema<typeof queryBuilder.dbSchema>['user/data']> ? Pick<UserData, Extract<keyof T, keyof UserData>> : never;

        const userData: Partial<UserData> = {};
        for (const key in data) {
            if (key === "registerTimeStamp") continue;
            if (key === "providerUserData") {
                userData.providerUserData = JSON.parse(data[key] as string)
            }
            else {
                userData[key as keyof UserData] = data[key] as any;
            }
        }

        return userData as Return;
    }
})