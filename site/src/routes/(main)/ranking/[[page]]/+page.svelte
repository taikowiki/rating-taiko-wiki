<script lang="ts">
    import { goto } from "$app/navigation";
    import PageSelector from "$lib/components/common/PageSelector.svelte";
    import RankingView from "$lib/components/ranking/RankingView.svelte";

    let { data } = $props();
</script>

<div class="container">
    {#each data.rankingData.datas as r}
        <RankingView {...r} />
    {/each}
</div>

<PageSelector
    pageNum={data.page}
    length={data.rankingData.count}
    countPerPage={50}
    movePage={(p) => goto(`/ranking/${p}`)}
/>

<style>
    .container{
        display:flex;
        flex-direction: column;
        row-gap: 5px;
    }
</style>