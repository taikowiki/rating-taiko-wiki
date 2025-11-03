import { WIKI_DB_DATABASE, WIKI_DB_HOST, WIKI_DB_PASSWORD, WIKI_DB_PORT, WIKI_DB_USER } from "$env/static/private";
import { DBConnector, QueryBuilder } from "@yowza/db-handler";

export const wikiDBConnector = new DBConnector({
    host: WIKI_DB_HOST,
    port: WIKI_DB_PORT,
    user: WIKI_DB_USER,
    database: WIKI_DB_DATABASE,
    password: WIKI_DB_PASSWORD
});

export const wikiQueryBuilder = new QueryBuilder({
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
    },
    'user/donder_data': {
        order: ['number'],
        UUID: ['string'],
        donder: ['string'],
        clearData: ['string', 'null'],
        scoreData: ['string', 'null'],
        currentRating: ['number', 'null'],
        currentExp: ['number', 'null'],
        ratingHistory: ['string'],
        expHistory: ['string'],
        lastUpdate: ['date'],
        ratingData: ['string', 'null'],
        lastRatingCalculate: ['date', 'null']
    }
});

export const queryBuilder = new QueryBuilder({
    'user/profile': {
        order: ['number'],
        UUID: ['string'],
        nickname: ['string'],
        bio: ['string']
    }
})