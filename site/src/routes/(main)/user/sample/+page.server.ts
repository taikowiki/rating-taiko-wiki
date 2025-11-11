import type { User } from "$lib/module/user";
import sampleRatingData from './sampleRatingData.json';
import sampleScoreData from './sampleScoreData.json';

const taikoProfile: User.TaikoProfile = {
    taikoNo: '000000000000',
    nickname: 'sample',
    crown: {
        donderfull: 10,
        gold: 100,
        silver: 400
    },
    badge: {
        rainbow: 10,
        purple: 28,
        pink: 35,
        gold: 53,
        silver: 68,
        bronze: 89,
        white: 4
    },
    dani: {
        dan: '1dan',
        type: 'red',
        frame: 'rainbow'
    }
};

const profile: User.Profile = {
    nickname: 'sample',
    UUID: 'sample',
    bio: 'Hello!'
};
const songRatingDatas = sampleRatingData.songRatingDatas as unknown as User.SongRatingData[];
const ratingData: User.RatingData = {
    currentRatingScore: sampleRatingData.currentRatingScore,
    currentExp: sampleRatingData.currentExp,
    songRatingDatas,
    ratingScoreHistory: [],
    lastUpload: new Date(),
    scoreData: sampleScoreData as unknown as User.ScoreData,
    ranking: 100
};

export async function load() {
    return {
        taikoProfile,
        profile,
        ratingData
    }
}