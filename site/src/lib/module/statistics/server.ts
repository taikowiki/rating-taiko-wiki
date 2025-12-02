import { defineDBHandler } from "@yowza/db-handler";
import { queryBuilder } from "../db/server";

export namespace statisticsDBController {
    export const ratingByDani = defineDBHandler(() => {
        const ratingScoreQuery = queryBuilder
            .select('user/rating_data', () => ({ currentRatingScore: 'currentRatingScore' }))
            .join('user/profile', () => ({}), 'inner', ({compare, column}) => [compare(column('user/rating_data.UUID'), '=', column('user/profile.UUID'))])
            .join('user/taiko_profile', () => ({dan: 'dan', danType: 'danType'}), 'inner', ({compare, column}) => [compare(column('user/rating_data.UUID'), '=', column('user/taiko_profile.UUID'))]);
        
        return async(run) => {
            return await ratingScoreQuery.execute(run);
        }        
    })
}