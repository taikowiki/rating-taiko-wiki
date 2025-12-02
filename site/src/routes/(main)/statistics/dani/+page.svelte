<script lang="ts">
    import DaniDistribution from "$lib/components/statistic/DaniDistribution.svelte";
    import RatingByDani from "$lib/components/statistic/RatingByDani.svelte";
    import { getI18n } from "$lib/module/i18n/index.js";
    import { getLang } from "$lib/module/layout/index.js";

    let { data } = $props();
    const lang = getLang();
    const i18n = $derived(getI18n($lang).statistic.dani);
</script>

<h1>{i18n.title}</h1>
<div class="info">
    {i18n.info}
</div>
<DaniDistribution
    statisticData={data.statisticData}
    myRatingData={data.myRatingData}
    myTaikoProfile={data.myTaikoProfiile}
/>
<RatingByDani
    statisticData={data.statisticData}
    myRatingData={data.myRatingData}
    myTaikoProfile={data.myTaikoProfiile}
/>

<style>
    .info {
        font-size: 13px;
        color: gray;
        margin-bottom: 20px;
    }
</style>
