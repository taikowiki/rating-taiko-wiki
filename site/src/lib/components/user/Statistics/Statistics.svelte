<script lang="ts">
    import { User } from "$lib/module/user";
    import Top50Statistics from "./Top50Statistics.svelte";
    import RatingHistory from "./RatingHistory.svelte";

    interface Props {
        top50: User.SongRatingData[];
        ratingScoreHistory: User.RatingData["ratingScoreHistory"];
    }

    let { top50, ratingScoreHistory }: Props = $props();
</script>

<h1>통계</h1>
<Top50Statistics {top50} />
{#if ratingScoreHistory.length}
    <RatingHistory {ratingScoreHistory} />
{/if}

<style>
    h1 {
        width: 100%;
    }
</style>
