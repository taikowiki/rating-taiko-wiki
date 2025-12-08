<script lang="ts">
    import { getTier, type User } from "$lib/module/user";
    import { CONST } from "$lib/module/util";
    import { SvelteMap } from "svelte/reactivity";
    import SongRatingByTierElement from "./SongRatingByTierElement.svelte";

    interface Props {
        statisticData: {
            songRatingData: User.SongRatingData;
            ratingData: Omit<User.RatingData, "scoreData" | "songRatingDatas">;
        }[];
        myData: User.SongRatingData | null;
        myRatingData?: User.RatingData;
    }

    let { statisticData, myData, myRatingData }: Props = $props();
    const grouped = $derived(groupByTier(statisticData));
    const myTierName = $derived(
        myRatingData ? getTier(myRatingData.currentRatingScore).tierName : null,
    );

    function groupByTier(statisticData: Props["statisticData"]) {
        const grouped = new SvelteMap<User.TierName, number[]>();
        statisticData.forEach((data) => {
            const { tierName } = getTier(data.ratingData.currentRatingScore);

            let arr = grouped.get(tierName);
            if (typeof arr === "undefined") {
                arr = [];
                grouped.set(tierName, arr);
            }
            arr.push(data.songRatingData.ratingScore);
        });
        return grouped;
    }
</script>

<div>
    <h2>티어 별 분포</h2>
    {#each CONST.RATING.TIER_NAME as tierName}
        {@const datas = grouped.get(tierName)}
        {#if datas}
            <SongRatingByTierElement {tierName} {datas} {myData} {myTierName} />
        {/if}
    {/each}
</div>
