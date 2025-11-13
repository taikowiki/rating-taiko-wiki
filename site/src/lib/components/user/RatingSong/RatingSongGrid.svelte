<script lang="ts">
    import { getTier, User } from "$lib/module/user";
    import white from "$lib/assets/icon/badge/white.png";
    import bronze from "$lib/assets/icon/badge/bronze.png";
    import silver from "$lib/assets/icon/badge/silver.png";
    import gold from "$lib/assets/icon/badge/gold.png";
    import pink from "$lib/assets/icon/badge/pink.png";
    import purple from "$lib/assets/icon/badge/purple.png";
    import rainbow from "$lib/assets/icon/badge/rainbow.png";
    import donderfullCrown from "$lib/assets/icon/crown/dfc.avif";
    import goldCrown from "$lib/assets/icon/crown/fc.avif";
    import silverCrown from "$lib/assets/icon/crown/clear.avif";
    import { getIsMobile, getTheme } from "$lib/module/layout";
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
        scoreData: User.ScoreData;
    }

    let { songRatingDatas, scoreData }: Props = $props();
    let scoreDataOpened = $state(songRatingDatas.map(() => false));

    const theme = getTheme();
    const isMobile = getIsMobile();

    function diffColor(diff: "oni" | "ura") {
        return COLOR.DIFFICULTY[diff];
    }
    function toggleScoreDataOpened(index: number) {
        return (event: Event) => {
            event.preventDefault();
            scoreDataOpened[index] = !scoreDataOpened[index];
        };
    }
    function scoreDataOpenedTri(index: number) {
        return scoreDataOpened[index] ? "▲" : "▼";
    }
</script>

<div class="ratingsong-grid-container" class:isMobile={$isMobile}>
    {#each songRatingDatas as data, i}
        {@render songRatingDataView(data, i)}
    {/each}
</div>

{#snippet songRatingDataView(data: User.SongRatingData, index: number)}
    {@const diffcolor = diffColor(data.difficulty)}
    {@const songScoreData =
        scoreData[data.songNo].difficulty?.[data.difficulty]}
    <a
        class={`ratingsong-data ${data.difficulty}`}
        style={`background-color: ${diffcolor};`}
        href={`//taiko.wiki/song/${data.songNo}?diff=${data.difficulty}`}
        target="_blank"
    >
        <div class="layer-1">
            <div class="box" style={`text-shadow: 0px 0px 3px ${diffcolor};`}>
                <span class="measureValue">{data.measureValue.toFixed(1)}</span>
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
        <div class="layer-3" onclick={toggleScoreDataOpened(index)}>
            <div class="crown-badge-accuracy-container">
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
                    <span>{scoreDataOpenedTri(index)}</span>
                </div>
            </div>
            {#if scoreDataOpened[index]}
                <div class="score-container">
                    <div>
                        <div class="ranking deco">順位</div>
                        {songScoreData?.ranking || "?"}
                    </div>
                    <div>
                        {songScoreData?.score ?? "?"}
                        <div class="score deco">点</div>
                    </div>
                    <div>
                        <div class="good deco">良</div>
                        {songScoreData?.good ?? "?"}
                    </div>
                    <div>
                        <div class="ok deco">可</div>
                        {songScoreData?.ok ?? "?"}
                    </div>
                    <div>
                        <div class="bad deco">不可</div>
                        {songScoreData?.bad ?? "?"}
                    </div>
                    <div>
                        <div class="roll deco">連打</div>
                        {songScoreData?.roll ?? "?"}
                    </div>
                    <div>
                        <div class="combo deco">コンボ</div>
                        {songScoreData?.maxCombo ?? "?"}
                    </div>
                </div>
            {/if}
        </div>
    </a>
{/snippet}

<style>
    .ratingsong-grid-container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, 188px);
        justify-content: center;
        flex-wrap: wrap;

        column-gap: 15px;
        row-gap: 15px;
        padding-block: 10px;

        &.isMobile {
            display: flex;
            flex-direction: column;
            row-gap: 10px;
        }
    }

    .ratingsong-data {
        width: 100%;
        border-radius: 5px;
        box-sizing: border-box;
        overflow: hidden;
        padding: 3px;
        display: flex;
        flex-direction: column;
        row-gap: 5px;
        color: white;
        text-decoration: none;
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
        flex: 1 0 auto;
        align-items: center;
    }

    .layer-3 {
        min-height: 25px;
        border-radius: 5px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        row-gap: 5px;

        box-sizing: border-box;
        padding-inline: 5px;
        padding-block: 3px;

        background-color: rgba(0, 0, 0, 0.15);
        & .crown-badge-accuracy-container {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }

        & .crown-badge-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            column-gap: 5px;

            & .crownImg,
            & .badgeImg {
                height: 19px;
            }
            & .badgeImg {
                transform: translateY(0.5px);
            }
        }
        & .accuracy {
            font-size: 12px;
            font-weight: bold;
        }

        & .score-container {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            flex-wrap: wrap;
            row-gap: 5px;
            column-gap: 8px;

            & > div {
                background-color: rgba(255, 255, 255, 0.2);

                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                column-gap: 3px;

                box-sizing: border-box;
                border-radius: 5px;
                font-size: 13px;

                padding-inline: 3px;
                padding-bottom: 1px;
                text-shadow: 0px 0px 2px black;

                & .deco {
                    font-weight: bold;
                    &.ranking {
                        color: #88c1c8;
                    }
                    &.good {
                        color: #ff7100;
                    }
                    &.ok{
                        color: #f9f9f9;
                    }
                    &.bad{
                        color: #1c9de6;
                    }
                    &.roll{
                        color: #ffc800;
                    }
                    &.combo{
                        color: #ff7070;
                    }
                }
            }
        }
    }
</style>
