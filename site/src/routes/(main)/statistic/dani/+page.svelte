<script lang="ts">
    import DaniDistribution from "$lib/components/statistic/dani/DaniDistribution.svelte";
    import RatingByDani from "$lib/components/statistic/dani/RatingByDani.svelte";
    import { getI18n } from "$lib/module/i18n/index.js";
    import { getLang } from "$lib/module/layout/index.js";

    let { data } = $props();
    const lang = getLang();
    const i18n = $derived(getI18n($lang).statistic);
</script>

<h1>{i18n.dani.title}</h1>
<div class="info">
    {i18n.info}
</div>
<div class="container">
    <DaniDistribution
        statisticData={data.statisticData}
        myTaikoProfile={data.myTaikoProfiile}
    />
    <RatingByDani
        statisticData={data.statisticData}
        myRatingData={data.myRatingData}
        myTaikoProfile={data.myTaikoProfiile}
    />
</div>

<style>
    .info {
        font-size: 13px;
        color: gray;
        margin-bottom: 20px;
    }

    .container {
        display: flex;
        flex-direction: column;
        row-gap: 50px;
    }
</style>
