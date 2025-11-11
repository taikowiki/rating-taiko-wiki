<script lang="ts">
    import Profile from "$lib/components/user/Profile/Profile.svelte";
    import RatingSong from "$lib/components/user/RatingSong/RatingSong.svelte";
    import Statistics from "$lib/components/user/Statistics/Statistics.svelte";
    import { getIsMobile } from "$lib/module/layout/index.js";

    let { data } = $props();
    let top50 = $derived(data.ratingData.songRatingDatas.slice(0, 50));
    let ratingScoreHistory = $derived(data.ratingData.ratingScoreHistory);

    const isMobile = getIsMobile();
</script>

<div class="container">
    <Profile
        profile={data.profile}
        taikoProfile={data.taikoProfile}
        lastUpdate={data.ratingData.lastUpload}
        currentRatingScore={data.ratingData.currentRatingScore}
        currentExp={data.ratingData.currentExp}
        ranking={data.ratingData.ranking}
    />
    <!--
    <RatingScore
        currentRatingScore={data.ratingData.currentRatingScore}
        currentExp={data.ratingData.currentExp}
        ranking={data.ratingData.ranking}
    />
    -->
    <RatingSong
        songRatingDatas={data.ratingData.songRatingDatas}
        scoreData={data.ratingData.scoreData}
    />
    <Statistics {top50} {ratingScoreHistory}/>
</div>

<style>
    .container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-inline: max(calc((100% - 1000px) / 2), 0px);
        box-sizing: border-box;
        row-gap: 10px;
    }
</style>
