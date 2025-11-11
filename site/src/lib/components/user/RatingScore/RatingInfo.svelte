<script lang="ts" module>
    export function getBG(tierName: User.TierName) {
        if (tierName === "omega") {
            return `linear-gradient(to right, ${COLOR.RATING.TIER.omega.map((c, i, a) => `${c} ${(i / (a.length - 1)) * 100}%`).join(", ")})`;
        } else {
            return `linear-gradient(to right, ${COLOR.RATING.TIER[tierName]})`;
        }
    }
</script>

<script lang="ts">
    import { getIsMobile, getTheme } from "$lib/module/layout";
    import type { getNextTier, getTier, User } from "$lib/module/user";
    import { COLOR } from "$lib/module/util";
    import TierImage from "../TierImage.svelte";
    import RatingProgressBar from "./RatingProgressBar.svelte";

    interface Props {
        ranking: number;
        ratingScore: number;
        exp: number;
        currentTier: ReturnType<typeof getTier>;
        nextTier: ReturnType<typeof getNextTier>;
    }

    let { ranking, ratingScore, currentTier, nextTier, exp }: Props = $props();

    const theme = getTheme();
    const isMobile = getIsMobile();
</script>

<div class="info-container" class:isMobile={$isMobile}>
    {#if $isMobile}
        {@render rankingDisplay()}
    {/if}
    <div class="layer-1" class:isMobile={$isMobile}>
        <div class="left">
            {#if !$isMobile}
                {@render rankingDisplay()}
            {/if}
            <TierImage
                tierName={currentTier.tierName}
                tierGrade={currentTier.tierGrade}
                size={80}
            />
            {@render tierDisplay()}
        </div>
        <div class="right">
            {@render ratingDisplay()}
        </div>
    </div>
    <div class="layer-2" class:isMobile={$isMobile}>
        {#if currentTier.tierName !== "omega"}
            <RatingProgressBar {ratingScore} {currentTier} {nextTier} />
        {/if}
    </div>
</div>

{#snippet rankingDisplay()}
    <div class={`ranking-container theme-${$theme}`} class:isMobile={$isMobile}>
        <div class="ranking-header" class:isMobile={$isMobile}>랭킹</div>
        <div class="ranking">
            #{ranking}
        </div>
    </div>
{/snippet}
{#snippet tierDisplay()}
    <div class="tier-container">
        <div class="tier-header">현재 티어</div>
        <div
            class="tier"
            style={`background-image:${getBG(currentTier.tierName)};`}
        >
            {currentTier.tierName.capitalize() +
                (currentTier.tierGrade ? ` ${currentTier.tierGrade}` : "")}
        </div>
    </div>
{/snippet}
{#snippet ratingDisplay()}
    <div class="rating-container">
        <div class="exp">
            Exp {exp}
        </div>
        <div class="rating-header">레이팅</div>
        <div
            class="rating"
            style={`background-image:${getBG(currentTier.tierName)};`}
        >
            {ratingScore}
        </div>
    </div>
{/snippet}

<style>
    .info-container {
        display: flex;
        flex-direction: row;
        row-gap: 10px;
        column-gap: 10px;

        &.isMobile {
            flex-direction: column;
        }
    }

    .layer-1,
    .layer-2 {
        width: calc(50% - 5px);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        & .left,
        & .right {
            display: flex;
            flex-direction: row;
            align-items: center;
            column-gap: 10px;
        }

        &.isMobile {
            width: 100%;
        }
    }

    .ranking-container {
        width: 80px;
        height: 80px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: 5px;
        border-radius: 10px;
        color: white;

        &.theme-light {
            background-color: #cf4844;
        }
        &.theme-dark {
            background-color: #0f0f0f;
        }
        &.isMobile {
            flex-direction: row;
            width: 100%;
            height: 40px;
            align-items: center;
            column-gap: 10px;
        }
        & .ranking-header {
            font-size: 10px;
            &.isMobile {
                font-size: 16px;
            }
        }
        & .ranking {
            font-weight: bold;
            font-size: 18px;
        }
    }

    .tier-container {
        & .tier-header {
            /*color: rgb(159, 159, 159);*/
            font-size: 13px;
        }
        & .tier {
            font-size: 25px;
            font-weight: bold;
            transform: translateY(-2px);
            background-clip: text;
            color: transparent;
        }
    }

    .rating-container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;

        & .exp {
            font-size: 10px;
            color: rgb(159, 159, 159);
        }
        & .rating {
            font-size: 25px;
            font-weight: bold;
            transform: translateY(-5px);
            background-clip: text;
            color: transparent;
        }
    }
</style>
