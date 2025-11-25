<script lang="ts">
    import { goto } from "$app/navigation";
    import PageSelector from "$lib/components/common/PageSelector.svelte";
    import PageTitle from "$lib/components/layout/main/Page-title.svelte";
    import RankingView from "$lib/components/ranking/RankingView.svelte";
    import { getI18n } from "$lib/module/i18n/index.js";
    import { getLang } from "$lib/module/layout/index.js";

    let { data } = $props();
    const lang = getLang();
    let i18n = $derived(getI18n($lang).ranking);
</script>

<PageTitle title={i18n.title.replace("%s", data.page.toString())} />
<div class="container">
    {#each data.rankingData.datas as d (d.UUID)}
        <RankingView
            ranking={d.ranking}
            nickname={d.nickname}
            currentRatingScore={d.currentRatingScore}
            UUID={d.UUID}
        />
    {/each}
</div>
<PageSelector
    pageNum={data.page}
    length={data.rankingData.count}
    countPerPage={50}
    movePage={(p) => goto(`/ranking/${p}`)}
/>

<style>
    .container {
        display: flex;
        flex-direction: column;
        row-gap: 5px;
    }
</style>
