<script lang="ts">
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
</script>

{#if ranking}
    <h3>내 랭킹: {ranking}위</h3>
{/if}