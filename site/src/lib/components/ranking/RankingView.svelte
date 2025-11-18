<script lang="ts">
    import { getTheme } from "$lib/module/layout";
    import { getTier } from "$lib/module/user";
    import { COLOR } from "$lib/module/util";
    import TierImage from "../user/TierImage.svelte";

    interface Props {
        ranking: number;
        nickname: string;
        currentRatingScore: number;
        UUID: string;
    }

    let { ranking, nickname, currentRatingScore, UUID }: Props = $props();

    const currentTier = getTier(currentRatingScore);
    const theme = getTheme();
</script>

<a class={`ranking-container theme-${$theme}`} href={`/user/${UUID}`}>
    <div class={`ranking theme-${$theme}`}>
        #{ranking}
    </div>
    <div class="score">
        <TierImage {...currentTier} size={45} />
        <span
            style={`background-image: ${COLOR.RATING.TIER_BG(currentTier.tierName)};`}
        >
            {currentRatingScore}
        </span>
    </div>
    <div class="nickname">
        {nickname}
    </div>
</a>

<style>
    .ranking-container {
        display: flex;
        align-items: center;
        column-gap: 15px;
        height: 50px;

        box-sizing: border-box;
        text-decoration: none;
        color: white;

        border-radius: 5px;

        &.theme-light {
            background-color: rgb(207, 72, 68);
        }
        &.theme-dark {
            background-color: rgb(15, 15, 15);
        }
    }

    .ranking {
        width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 20px;
    }

    .score {
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 10px;

        font-weight: bold;
        font-size: 20px;

        & span {
            transform: translateY(-2px);
            color: transparent;
            background-clip: text;
        }
    }
</style>
