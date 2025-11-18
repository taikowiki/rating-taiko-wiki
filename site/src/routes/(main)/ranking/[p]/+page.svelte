<script lang="ts">
    import { goto } from "$app/navigation";
    import PageSelector from "$lib/components/common/PageSelector.svelte";
    import PageTitle from "$lib/components/layout/main/Page-title.svelte";
    import RankingView from "$lib/components/ranking/RankingView.svelte";

    let { data } = $props();
</script>

<PageTitle title={`랭킹 ${data.page}`}/>
<div class="container">
    {#each data.rankingData.datas as d}
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
