import { statisticsDBController } from "$lib/module/statistics/server";
import type { User } from "$lib/module/user";
import { REGULAR_DAN } from "@taiko-wiki/taikowiki-api";
import { CONST } from "$lib/module/util";

type NijiiroRegularDan = typeof CONST.DANI.NIJIIRO_REGULAR_DAN[number];

export async function load() {
    const datas = await statisticsDBController.ratingByDani();

    const statisticData = getStatisticData(datas);

    return {
        statisticData
    }
}

type InputData = ({
    currentRatingScore: number;
} & {} & {
    dan: number | null;
    danType: number | null;
});
type OutputData = ({
    currentRatingScore: number;
} & {} & {
    dan: User.Dani['dan']
    danType: 'red' | 'gold';
});
function getStatisticData(datas: InputData[]): Record<typeof CONST.DANI.NIJIIRO_REGULAR_DAN[number], OutputData[]> {
    const statisticData: Partial<Record<NijiiroRegularDan, OutputData[]>> = {};

    datas.forEach((data) => {
        if (!data.dan || !data.danType) return;
        if (!data.currentRatingScore) return;
        const key = CONST.DANI.NIJIIRO_REGULAR_DAN[data.dan - 1];
        if (!(key in statisticData)) {
            statisticData[key] = [];
        }
        statisticData[key]?.push({
            currentRatingScore: data.currentRatingScore,
            dan: key,
            danType: (['red', 'gold'] as const)[data.danType - 1]
        });
    });

    Object.values(statisticData).forEach((datas) => {
        datas.sort((a, b) => a.currentRatingScore - b.currentRatingScore)
    })

    return statisticData as Record<NijiiroRegularDan, OutputData[]>;
}