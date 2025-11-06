import { REGULAR_DAN, type SongData } from "@taiko-wiki/taikowiki-api";
import z from "zod";
import { getSongRating } from '@taiko-wiki/taiko-rating';
import type { Measure } from "@taiko-wiki/taiko-rating/types";
import { CONST } from "../util";

/**
 * 레이팅 계산
 */
export function calcualteRating(scoreData: User.ScoreData, measures: Measure[], songDatas: SongData[]): Pick<User.RatingData, 'currentRatingScore' | 'currentExp' | 'songRatingDatas'> {
    const songRatingDatas: User.SongRatingData[] = [];
    measures.forEach((measure) => {
        const difficultyScoreData = scoreData[measure.songno]?.difficulty?.[measure.diff];
        if (!difficultyScoreData) return;

        const songRatingData = getSongRating(difficultyScoreData, measure.notes, measure.measureValue, measure.maxroll);
        const songData = songDatas.find(({ songNo }) => songNo === measure.songno);

        songRatingDatas.push({
            title: songData?.title ?? measure.title,
            songNo: measure.songno,
            difficulty: measure.diff,
            measureValue: measure.measureValue,
            accuracy: songRatingData.accuracy,
            crown: difficultyScoreData.crown,
            badge: difficultyScoreData.badge,
            ratingScore: songRatingData.value
        });
    });
    songRatingDatas.sort((a, b) => b.ratingScore - a.ratingScore);

    //rating
    let top50Sum = 0;
    for (let i = 0; i < Math.min(50, songRatingDatas.length); i++) {
        top50Sum += songRatingDatas[i].ratingScore;
    }
    const currentRatingScore = Math.ceil(top50Sum / 50);

    //exp
    let firstSum = 0;
    for (let i = 0; i < Math.min(30, songRatingDatas.length); i++) {
        firstSum += songRatingDatas[i].ratingScore;
    }
    let secondSum = 0;
    if (songRatingDatas.length > 30) {
        for (let i = 30; i < Math.min(50, songRatingDatas.length); i++) {
            secondSum += songRatingDatas[i].ratingScore * 0.9;
        }
    }
    let average = (firstSum + secondSum) / 50;
    let otherSum = 0;
    if (songRatingDatas.length > 50) {
        for (let i = 50; i < Math.min(100, songRatingDatas.length); i++) {
            otherSum += songRatingDatas[i].ratingScore * 0.01;
        }
    }
    if (songRatingDatas.length > 100) {
        for (let i = 100; i < Math.min(150, songRatingDatas.length); i++) {
            otherSum += songRatingDatas[i].ratingScore * 0.001;
        }
    }
    if (songRatingDatas.length > 150) {
        for (let i = 150; i < songRatingDatas.length; i++) {
            otherSum += songRatingDatas[i].ratingScore * 0.0001;
        }
    }
    const currentExp = Math.ceil(average + otherSum);

    return {
        currentRatingScore,
        currentExp,
        songRatingDatas
    }
}

/**
 * 현재 티어를 계산
 */
export function getTier(ratingScore: number) {
    const { TIER_BORDER, GRADE_INTERVAL } = CONST.RATING;
    let tierName: User.TierName;
    if (ratingScore < TIER_BORDER.bronze) {
        tierName = 'pearl';
    }
    else if (ratingScore < TIER_BORDER.silver) {
        tierName = 'bronze';
    }
    else if (ratingScore < TIER_BORDER.gold) {
        tierName = 'silver'
    }
    else if (ratingScore < TIER_BORDER.ruby) {
        tierName = 'gold'
    }
    else if (ratingScore < TIER_BORDER.sapphire) {
        tierName = 'ruby'
    }
    else if (ratingScore < TIER_BORDER.master) {
        tierName = 'sapphire'
    }
    else if (ratingScore < TIER_BORDER.grandmaster) {
        tierName = "master"
    }
    else if (ratingScore < TIER_BORDER.omega) {
        tierName = "grandmaster"
    }
    else {
        tierName = 'omega';
    }

    let tierGrade: 1 | 2 | 3 | 4 | 5 | null;
    if (tierName === 'omega' || tierName === 'pearl' || tierName === "master" || tierName === "grandmaster") {
        tierGrade = null;
    }
    else if (tierName === "sapphire") {
        const startBorder = TIER_BORDER[tierName];

        if (ratingScore < startBorder + GRADE_INTERVAL) {
            tierGrade = 3;
        }
        else if (ratingScore < startBorder + GRADE_INTERVAL * 2) {
            tierGrade = 2;
        }
        else {
            tierGrade = 1;
        }
    }
    else {
        const startBorder = TIER_BORDER[tierName];

        if (ratingScore < startBorder + GRADE_INTERVAL) {
            tierGrade = 5;
        }
        else if (ratingScore < startBorder + GRADE_INTERVAL * 2) {
            tierGrade = 4;
        }
        else if (ratingScore < startBorder + GRADE_INTERVAL * 3) {
            tierGrade = 3;
        }
        else if (ratingScore < startBorder + GRADE_INTERVAL * 4) {
            tierGrade = 2;
        }
        else {
            tierGrade = 1;
        }
    }

    return {
        tierName,
        tierGrade
    }
}

/**
 * 다음 티어를 계산
 */
export function getNextTier(tierName: User.TierName, grade: number | null) {
    let nextTierName: User.TierName;
    let nextGrade: { tierName: User.TierName, grade: number | null };

    if (tierName === 'pearl') {
        nextTierName = 'bronze';
        nextGrade = {
            tierName: 'bronze',
            grade: 5
        }
    }
    else if (tierName === 'bronze') {
        nextTierName = 'silver';
        nextGrade = {
            tierName: grade === 1 ? 'silver' : 'bronze',
            grade: grade === 1 ? 5 : (grade ?? 5) - 1
        }
    }
    else if (tierName === 'silver') {
        nextTierName = 'gold'
        nextGrade = {
            tierName: grade === 1 ? 'gold' : 'silver',
            grade: grade === 1 ? 5 : (grade ?? 5) - 1
        }
    }
    else if (tierName === 'gold') {
        nextTierName = 'ruby'
        nextGrade = {
            tierName: grade === 1 ? 'ruby' : 'gold',
            grade: grade === 1 ? 5 : (grade ?? 5) - 1
        }
    }
    else if (tierName === 'ruby') {
        nextTierName = 'sapphire'
        nextGrade = {
            tierName: grade === 1 ? 'sapphire' : 'ruby',
            grade: grade === 1 ? 3 : (grade ?? 5) - 1
        }
    }
    else if (tierName === 'sapphire') {
        nextTierName = 'master'
        nextGrade = {
            tierName: grade === 1 ? 'master' : 'sapphire',
            grade: grade === 1 ? null : (grade ?? 3) - 1
        }
    }
    else if (tierName === "master") {
        nextTierName = "grandmaster";
        nextGrade = {
            tierName: "grandmaster",
            grade: null
        }
    }
    else {
        nextTierName = 'omega'
        nextGrade = {
            tierName: "omega",
            grade: null
        }
    }

    return { nextTierName, nextGrade };
}

export namespace User {
    export namespace Schema {
        export const Crown = z.literal(['donderfull', 'gold', 'silver', 'played']);
        export const Badge = z.literal(['rainbow', 'purple', 'pink', 'gold', 'silver', 'bronze', 'white']);
        export const Difficulty = z.literal(['easy', 'normal', 'hard', 'oni', 'ura']);
        export const Data = z.object({
            provider: z.string(),
            providerId: z.string(),
            UUID: z.string(),
            lang: z.string()
        });
        export const Profile = z.object({
            UUID: z.string(),
            nickname: z.string(),
            bio: z.string()
        });
        export const Dani = z.object({
            dan: z.literal(CONST.DANI.NIJIIRO_REGULAR_DAN),
            type: z.literal(['red', 'gold']),
            frame: z.literal(['silver', 'gold', 'rainbow'])
        });
        export const TaikoProfile = z.object({
            taikoNo: z.string(),
            nickname: z.string(),
            crown: z.object({
                donderfull: z.number(),
                gold: z.number(),
                silver: z.number()
            }),
            badge: z.object({
                'rainbow': z.number(),
                'purple': z.number(),
                'pink': z.number(),
                'gold': z.number(),
                'silver': z.number(),
                'bronze': z.number(),
                'white': z.number()
            }),
            dani: z.nullable(Dani)
        });

        export const DifficultyScoreData = z.object({
            crown: z.nullable(Crown),
            badge: z.nullable(Badge),
            score: z.number(),
            ranking: z.nullable(z.number()),
            good: z.number(),
            ok: z.number(),
            bad: z.number(),
            maxCombo: z.number(),
            roll: z.number(),
            count: z.object({
                donderfullcombo: z.number(),
                fullcombo: z.number(),
                clear: z.number(),
                play: z.number()
            })
        });
        export const SongScoreData = z.object({
            songNo: z.string(),
            title: z.string(),
            difficulty: z.record(Difficulty, z.union([DifficultyScoreData, z.undefined()]))
        });
        export const ScoreData = z.record(z.string(), SongScoreData);

        export const SongRatingData = z.object({
            title: z.string(),
            songNo: z.string(),
            difficulty: z.literal(['oni', 'ura']),
            measureValue: z.number(),
            accuracy: z.number(),
            crown: z.nullable(Crown),
            badge: z.nullable(Badge),
            ratingScore: z.number()
        });
        export const RatingData = z.object({
            currentRatingScore: z.number(),
            currentExp: z.number(),
            ratingScoreHistory: z.array(z.tuple([z.date(), z.number()])),
            lastUpload: z.date(),
            scoreData: ScoreData,
            songRatingDatas: z.array(SongRatingData),
            ranking: z.number()
        });

        export const TierName = z.literal(CONST.RATING.TIER_NAME);
    }

    export type Data = z.infer<typeof Schema.Data>;
    export type Profile = z.infer<typeof Schema.Profile>;
    export type Dani = z.infer<typeof Schema.Dani>;
    export type TaikoProfile = z.infer<typeof Schema.TaikoProfile>;
    export type DifficultyScoreData = z.infer<typeof Schema.DifficultyScoreData>;
    export type SongScoreData = z.infer<typeof Schema.SongScoreData>;
    export type ScoreData = { [songNo: string]: SongScoreData };
    export type SongRatingData = z.infer<typeof Schema.SongRatingData>;
    export type RatingData = z.infer<typeof Schema.RatingData>;
    export type Crown = z.infer<typeof Schema.Crown>;
    export type Badge = z.infer<typeof Schema.Badge>;

    export type TierName = z.infer<typeof Schema.TierName>;
}