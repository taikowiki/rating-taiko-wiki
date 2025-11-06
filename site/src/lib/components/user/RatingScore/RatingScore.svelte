<script lang="ts">
    import { getNextTier, getTier, User } from "$lib/module/user";
    import RatingInfo from "./RatingInfo.svelte";

    interface Props {
        currentRatingScore: number;
        currentExp: number;
        ranking: number;
    }

    let { currentRatingScore, currentExp, ranking }: Props = $props();

    const currentTier = getTier(currentRatingScore);
    const nextTier = getNextTier(currentTier.tierName, currentTier.tierGrade);
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
