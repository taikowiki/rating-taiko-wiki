<script lang="ts">
    import { getI18n } from "$lib/module/i18n";
    import { getLang } from "$lib/module/layout";
    import type { User } from "$lib/module/user";

    interface Props {
        statisticData: {
            songRatingData: User.SongRatingData;
            ratingData: Omit<User.RatingData, "scoreData" | "songRatingDatas">;
        }[];
        myData: User.SongRatingData | null;
    }

    let {statisticData, myData}: Props = $props();
    const ranking = $derived(getRanking(statisticData, myData));
    
    function getRanking(statisticData: Props['statisticData'], myData: Props['myData']){
        if(!myData) return null;
        let ranking = 1;
        for(const data of statisticData){
            if(data.songRatingData.ratingScore > myData.ratingScore){
                ranking++;
            }
            else{
                break;
            }
        }
        return ranking;
    }

    const lang = getLang();
    const i18n = $derived(getI18n($lang).statistic.song)
</script>

{#if ranking}
    <h3>{i18n.myRanking(ranking)}</h3>
{/if}