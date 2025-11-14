<script lang="ts">
    import { getNextTier, getTier, User } from "$lib/module/user";
    import RatingInfo from "./RatingInfo.svelte";

    interface Props {
        currentRatingScore: number;
        currentExp: number;
        ranking: number;
        currentTier: ReturnType<typeof getTier>;
        nextTier: ReturnType<typeof getNextTier>;
    }

    let { currentRatingScore, currentExp, ranking, currentTier, nextTier }: Props = $props();
</script>

<div class="container">
    <RatingInfo
        {ranking}
        ratingScore={currentRatingScore}
        exp={currentExp}
        {currentTier}
        {nextTier}
    />
</div>

<style>
    .container {
        width: 100%;
    }
</style>
