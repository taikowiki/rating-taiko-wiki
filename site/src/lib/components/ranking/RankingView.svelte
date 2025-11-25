<script lang="ts">
    import { getIsMobile, getTheme } from "$lib/module/layout";
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
    const isMobile = getIsMobile();
</script>

<a
    class={`ranking-container theme-${$theme}`}
    class:isMobile={$isMobile}
    href={`/user/${UUID}`}
>
    <div class={`ranking theme-${$theme}`} class:isMobile={$isMobile}>
        #{ranking}
    </div>
    <div class="score" class:isMobile={$isMobile}>
        <TierImage {...currentTier} size={$isMobile ? 40 : 45} />
        <span
            class={`theme-${$theme}`}
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
        column-gap: 10px;
        min-height: 50px;

        box-sizing: border-box;
        text-decoration: none;
        color: inherit;

        border-radius: 5px;

        &.theme-light {
            box-shadow: 0px 0px 2px 0px rgb(207, 72, 68);
            background-color: #f9f9f9;
        }
        &.theme-dark {
            background-color: rgb(15, 15, 15);
        }
        &.isMobile {
            column-gap: 0px;
        }
    }

    .ranking {
        width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 20px;

        &.isMobile {
            width: 55px;
            font-size: 16px;
        }
    }

    .score {
        width: 120px;
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 10px;

        font-weight: bold;
        font-size: 20px;

        & span {
            transform: translateY(-1px);
            color: transparent;
            background-clip: text;
        }
        &.isMobile {
            width: 95px;
            font-size: 16px;
            column-gap: 5px;
            margin-right: 10px;
        }
    }

    .nickname {
        flex: 1 0 0;
        transform: translateY(-1px);
        word-break: break-all;
        box-sizing: border-box;
        padding-right: 7px;
    }
</style>
