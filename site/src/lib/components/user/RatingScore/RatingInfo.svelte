<script lang="ts">
    import { getIsMobile, getTheme } from "$lib/module/layout";
    import type { getNextTier, getTier } from "$lib/module/user";
    import { COLOR } from "$lib/module/util";
    import TierImage from "../TierImage.svelte";

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

    function getBG() {
        if (currentTier.tierName === "omega") {
            return `linear-gradient(to right, ${COLOR.RATING.TIER.omega.map((c, i, a) => `${c} ${(i / (a.length - 1)) * 100}%`).join(", ")})`;
        } else {
            return `linear-gradient(to right, ${COLOR.RATING.TIER[currentTier.tierName]})`;
        }
    }
</script>

<div class="container" class:isMobile={$isMobile}>
    {#if $isMobile}
        {@render rankingDisplay()}
    {/if}
    <div class="layer-1">
        <div class="left">
            {#if !$isMobile}
                {@render rankingDisplay()}
            {/if}
            <TierImage
                tierName={currentTier.tierName}
                tierGrade={currentTier.tierGrade}
                size={80}
            />
            <div class="tier-container">
                <div class="tier-header">현재 티어</div>
                <div class="tier" style={`background-image:${getBG()};`}>
                    {currentTier.tierName.capitalize() +
                        (currentTier.tierGrade
                            ? ` ${currentTier.tierGrade}`
                            : "")}
                </div>
            </div>
        </div>
        <div class="right">
            <div class="rating-container">
                <div class="exp">
                    Exp {exp}
                </div>
                <div class="rating-header">레이팅</div>
                <div class="rating" style={`background-image:${getBG()};`}>
                    {ratingScore}
                </div>
            </div>
        </div>
    </div>
</div>

{#snippet rankingDisplay()}
    <div class={`ranking-container theme-${$theme}`} class:isMobile={$isMobile}>
        <div class="ranking-header">랭킹</div>
        <div class="ranking">
            #{ranking}
        </div>
    </div>
{/snippet}

<style>
    .layer-1 {
        width: 100%;
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
        &.isMobile{
            flex-direction: row;
            width: 100%;
            align-items: center;
        }

        & .ranking-header {
            font-size: 10px;
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
            transform: translateY(-5px);
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
