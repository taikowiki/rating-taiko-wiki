<script lang="ts">
    import { getI18n } from "$lib/module/i18n";
    import { getLang } from "$lib/module/layout";
    import type { User } from "$lib/module/user";
    import { CONST } from "$lib/module/util";
    import RatingByDaniComponent from "./RatingByDaniComponent.svelte";

    interface Props {
        myRatingData?: User.RatingData;
        myTaikoProfile?: User.TaikoProfile;
        statisticData: Record<
            User.Dani["dan"],
            {
                currentRatingScore: number;
                dan: User.Dani["dan"];
                danType: "red" | "gold";
            }[]
        >;
    }

    let { myRatingData, myTaikoProfile, statisticData }: Props = $props();

    const lang = getLang();
    const i18n = $derived(getI18n($lang).statistic);
</script>

<div class="section">
    <h2>{i18n.dani.ratingScoreByDani}</h2>
    {#each CONST.DANI.NIJIIRO_REGULAR_DAN as dan}
        {#if statisticData[dan]}
            <RatingByDaniComponent
                {dan}
                datas={statisticData[dan]}
                {myRatingData}
                {myTaikoProfile}
            />
        {/if}
    {/each}
</div>