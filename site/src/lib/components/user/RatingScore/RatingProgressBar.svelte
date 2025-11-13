<script lang="ts">
    import type { getTier, getNextTier, User } from "$lib/module/user";
    import { COLOR, CONST } from "$lib/module/util";

    interface Props {
        ratingScore: number;
        currentTier: ReturnType<typeof getTier>;
        nextTier: ReturnType<typeof getNextTier>;
    }

    interface T {
        name: User.TierName;
        grade: number | null;
        border: number;
    }

    let { ratingScore, currentTier, nextTier }: Props = $props();
    const currentTierBorder = CONST.RATING.TIER_BORDER[currentTier.tierName];
    const currentGradeBorder =
        CONST.RATING.TIER_BORDER[currentTier.tierName] +
        (currentTier.tierGrade
            ? (currentTier.tierName === "sapphire"
                  ? 3 - currentTier.tierGrade
                  : 5 - currentTier.tierGrade) * CONST.RATING.GRADE_INTERVAL
            : 0);
    const nextTierBorder = CONST.RATING.TIER_BORDER[nextTier.nextTierName];
    const nextGradeBorder = currentGradeBorder + CONST.RATING.GRADE_INTERVAL;

    function getPercent(fromBorder: number, toBorder: number, current: number) {
        const p =
            Math.round(
                (10000 * (current - fromBorder)) / (toBorder - fromBorder),
            ) / 100;
        if (!Number.isFinite(p)) return "";
        return p + "%";
    }
</script>

<div class="container">
    {@render progressBar(
        {
            name: currentTier.tierName,
            grade: currentTier.tierGrade,
            border: currentTierBorder,
        },
        {
            name: nextTier.nextTierName,
            grade: null,
            border: nextTierBorder,
        },
        ratingScore,
    )}
    {@render progressBar(
        {
            name: currentTier.tierName,
            grade: currentTier.tierGrade,
            border: currentGradeBorder,
        },
        {
            name: nextTier.nextGrade.tierName,
            grade: nextTier.nextGrade.grade,
            border: nextGradeBorder,
        },
        ratingScore,
    )}
</div>

{#snippet progressBar(from: T, to: T, currentRatingScore: number)}
    <div class="progress-container">
        <div class="layer-1">
            <div class="left" style={`background:${COLOR.RATING.TIER_BG(from.name)} text;`}>
                {getPercent(from.border, to.border, currentRatingScore)}
            </div>
            <div class="right" style={`background:${COLOR.RATING.TIER_BG(to.name)} text;`}>
                {to.name.capitalize() + (to.grade ? " " + to.grade : "")}
            </div>
        </div>
        <div class="layer-2">
            <div
                class="bar"
                style={`background:${COLOR.RATING.TIER_BG(from.name)}; width: calc(100% * ${currentRatingScore - from.border} / ${to.border - from.border});`}
            ></div>
        </div>
    </div>
{/snippet}

<style>
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }

    .layer-1 {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .layer-2 {
        width: 100%;
        height: 8px;
        border-radius: 4px;
        background-color: #bebebe;
        overflow: hidden;

        & .bar {
            height: 100%;
        }
    }

    .progress-container {
        display: flex;
        flex-direction: column;
        row-gap: 5px;

        & .left,
        & .right {
            font-weight: bold;
            color: transparent;
        }
    }
</style>
