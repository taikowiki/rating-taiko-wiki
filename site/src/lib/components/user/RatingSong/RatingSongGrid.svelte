<script lang="ts">
    import { getTier, User } from "$lib/module/user";
    import white from "$lib/assets/icon/badge/white.png";
    import bronze from "$lib/assets/icon/badge/bronze.png";
    import silver from "$lib/assets/icon/badge/silver.png";
    import gold from "$lib/assets/icon/badge/gold.png";
    import pink from "$lib/assets/icon/badge/pink.png";
    import purple from "$lib/assets/icon/badge/purple.png";
    import rainbow from "$lib/assets/icon/badge/rainbow.png";
    import donderfullCrown from "$lib/assets/icon/crown/dfc.svg";
    import goldCrown from "$lib/assets/icon/crown/fc.svg";
    import silverCrown from "$lib/assets/icon/crown/clear.svg";
    import { getTheme } from "$lib/module/layout";
    import { COLOR } from "$lib/module/util";

    const crownImg = {
        donderfull: donderfullCrown,
        gold: goldCrown,
        silver: silverCrown,
    };
    const badgeImg = {
        rainbow,
        purple,
        pink,
        gold,
        silver,
        bronze,
        white,
    };

    interface Props {
        songRatingDatas: User.SongRatingData[];
    }

    let { songRatingDatas }: Props = $props();

    const theme = getTheme();

    function diffColor(diff: "oni" | "ura") {
        if ($theme === "light") return COLOR.DIFFICULTY[diff];
        if ($theme === "dark") return COLOR.DARK_DIFFICULTY[diff];
    }
</script>

<div class="ratingsong-grid-container">
    {#each songRatingDatas as data}
        {@render songRatingDataView(data)}
    {/each}
</div>

{#snippet songRatingDataView(data: User.SongRatingData)}
    {@const diffcolor = diffColor(data.difficulty)}
    {@const tiercolor = COLOR.RATING.TIER_BG(
        getTier(data.ratingScore).tierName,
    )}
    <div
        class={`ratingsong-data ${data.difficulty}`}
        style={`background-color: ${diffcolor};`}
    >
        <div class="layer-1">
            <div class="box" style={`text-shadow: 0px 0px 3px ${diffcolor};`}>
                <span class="measureValue">{data.measureValue}</span>
                <span class="ratingScore">
                    {data.ratingScore}
                </span>
            </div>
        </div>
        <div
            class="layer-2"
            style={`background: ${diffColor(data.difficulty)};`}
        >
            {data.title}
        </div>
        <div class="layer-3">
            <div class="crown-badge-container">
                {#if data.crown && data.crown in crownImg}
                    <img
                        class="crownImg"
                        src={crownImg[data.crown as keyof typeof crownImg]}
                        alt={data.crown}
                    />
                {/if}
                {#if data.badge && data.badge in badgeImg}
                    <img
                        class="badgeImg"
                        src={badgeImg[data.badge]}
                        alt={data.badge}
                    />
                {/if}
            </div>
            <div class="accuracy">
                {Math.round(data.accuracy * 100) / 100}%
            </div>
        </div>
    </div>
{/snippet}

<style>
    .ratingsong-grid-container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, 188px);
        flex-wrap: wrap;
        
        column-gap: 15px;
        row-gap: 15px;
        padding-block: 10px;
    }

    .ratingsong-data {
        width: 188px;
        border-radius: 5px;
        box-sizing: border-box;
        overflow: hidden;
        padding: 3px;
        display: flex;
        flex-direction: column;
        row-gap: 5px;
        color: white;
    }

    .layer-1,
    .layer-2,
    .layer-3 {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .layer-2 {
        justify-content: center;
        text-align: center;
        text-wrap: balance;
        padding-bottom: 3px;
    }

    .layer-1 {
        align-items: center;
        justify-content: flex-start;
        height: 25px;
        box-sizing: border-box;
        & .box {
            height: 25px;
            box-sizing: border-box;
            border-radius: 5px;
            background-color: rgba(255, 255, 255, 0.2);

            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: flex-end;
            column-gap: 3px;

            padding-inline: 5px;
            padding-bottom: 1px;
        }
        & .ratingScore {
            border-radius: 5px;
            font-size: 12px;
            transform: translateY(-1.5px);
            color: white;
        }
        & .measureValue {
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            font-size: 18px;
            font-weight: bold;
        }
    }

    .layer-2 {
        font-weight: bold;
        height: calc(100% - 60px);
        align-items: center;
    }

    .layer-3 {
        height: 25px;
        border-radius: 5px;

        display:flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        box-sizing: border-box;
        padding-inline: 5px;
        
        background-color: rgba(0, 0, 0, 0.15);
        & .crown-badge-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            column-gap: 5px;

            & .crownImg,
            & .badgeImg {
                height: 19px;
            }
            & .badgeImg{
                transform: translateY(0.5px);
            }
        }
        & .accuracy{
            font-size: 12px;
            font-weight: bold;
        }
    }
</style>
