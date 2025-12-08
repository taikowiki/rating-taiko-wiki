import { defineDBHandler } from "@yowza/db-handler";
import { dbConverter, queryBuilder, type DBSchema } from "../db/server";
import type { User } from "../user";

export namespace statisticsDBController {
    export const ratingByDani = defineDBHandler(() => {
        const ratingScoreQuery = queryBuilder
            .select('user/rating_data', () => ({ currentRatingScore: 'currentRatingScore' }))
            .join('user/profile', () => ({}), 'inner', ({ compare, column }) => [compare(column('user/rating_data.UUID'), '=', column('user/profile.UUID'))])
            .join('user/taiko_profile', () => ({ dan: 'dan', danType: 'danType' }), 'inner', ({ compare, column }) => [compare(column('user/rating_data.UUID'), '=', column('user/taiko_profile.UUID'))]);

        return async (run) => {
            return await ratingScoreQuery.execute(run);
        }
    });
    export const getSongStatistic = defineDBHandler<
        [songNo: string, diff: 'oni' | 'ura'],
        { songRatingData: User.SongRatingData, ratingData: Omit<User.RatingData, "scoreData" | "songRatingDatas"> }[]
    >
        ((songNo, diff) => {
            const query = queryBuilder
                .select('user/song_rating_data', '*')
                .join('user/rating_data', '*', 'inner', ({ compare, column }) => [
                    compare(column('user/song_rating_data.UUID'), '=', column('user/rating_data.UUID'))
                ])
                .where(({ compare, column, value }) => [
                    compare(column('user/song_rating_data.songNo'), '=', value(songNo)),
                    compare(column('user/song_rating_data.difficulty'), '=', value(diff === 'oni' ? 0 : 1))
                ]);
            return async (run) => {
                const rows = await query.execute(run);
                return rows.map((row) => ({
                    ratingData: dbConverter.fromDB.ratingData(row),
                    songRatingData: dbConverter.fromDB.songRatingData(row)
                }))
            };
        })
}