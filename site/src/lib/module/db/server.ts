import type { SongData } from "@taiko-wiki/taikowiki-api/types";
import { DBConnector, QueryBuilder } from "@yowza/db-handler";
import type { InferDBSchema } from "@yowza/db-handler/types";

export const wikiDBConnector = new DBConnector({
    host: process.env.WIKI_DB_HOST,
    port: process.env.WIKI_DB_PORT,
    user: process.env.WIKI_DB_USER,
    database: process.env.WIKI_DB_DATABASE,
    password: process.env.WIKI_DB_PASSWORD
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
    },
    song: {
        songNo: ['string'],
        order: ['number'],
        title: ['string'],
        titleKo: ['string', 'null'],
        aliasKo: ['string', 'null'],
        titleEn: ['string', 'null'],
        aliasEn: ['string', 'null'],
        romaji: ['string', 'null'],
        bpm: ['string'],
        bpmShiver: ['number'],
        version: ['string'],
        isAsiaBanned: ['number'],
        isKrBanned: ['number'],
        genre: ['string'],
        artists: ['string'],
        addedDate: ['number', 'null'],
        courses: ['string'],
        isDeleted: ['number']
    },
});
export type WikiDBSchema = InferDBSchema<typeof wikiQueryBuilder['dbSchema']>;

export const queryBuilder = new QueryBuilder({
    'user/profile': {
        order: ['number'],
        UUID: ['string'],
        nickname: ['string'],
        bio: ['string']
    }
});
export type DBSchema = InferDBSchema<typeof queryBuilder['dbSchema']>;

export const dbConverter = {
    fromDB: {
        song<K extends keyof WikiDBSchema['song']>(data: Pick<WikiDBSchema['song'], K>): Pick<SongData, Exclude<K, 'order'>> {
            const songData: Partial<SongData> = {};
            Object.keys(data).forEach((_) => {
                const key = _ as K;
                if (key === "courses") {
                    songData.courses = JSON.parse((data as WikiDBSchema['song']).courses);
                    if (songData.courses && !songData.courses?.ura) {
                        songData.courses.ura = null;
                    }
                }
                else if (key === "bpm") {
                    songData.bpm = JSON.parse((data as WikiDBSchema['song']).bpm);
                }
                else if (key === "version") {
                    songData.version = JSON.parse((data as WikiDBSchema['song']).version)
                }
                else if (key === "genre") {
                    songData.genre = JSON.parse((data as WikiDBSchema['song']).genre)
                }
                else if (key === "artists") {
                    songData.artists = JSON.parse((data as WikiDBSchema['song']).artists)
                }
                else if (key === "order") {
                    return;
                }
                else {
                    //@ts-expect-error
                    songData[key] = data[key];
                }
            });
            return songData as Pick<SongData, Exclude<K, 'order'>>;
        }
    }
}