import Bun from 'bun'
import path from 'node:path'

const json = await Bun.file(path.join(import.meta.dir, 'user_donder_data.json')).text();
const datas: any[] = JSON.parse(json);

const refined = datas.map((data, i) => {
    if (data.ratingData) {
        const ratingData = JSON.parse(data.ratingData);
        return {
            currentRating: data.currentRating,
            songRatingDatas: ratingData.map((s: any) => ({
                measure: s.songRating.measureValue,
                accuracy: s.songRating.accuracy,
                ratingScore: s.songRating.value
            })).sort((a: any, b: any) => b.ratingScore - a.ratingScore)
        }
    }
    return null;
}).filter((e) => Boolean(e));

Bun.write(path.join(import.meta.dir, 'refined.json'), JSON.stringify(refined, null, 2));