<script lang="ts">
    import { User } from "$lib/module/user";
    import RatingSongGrid from "./RatingSongGrid.svelte";
    import RatingSongList from "./RatingSongList.svelte";
    import gridImg from "$lib/assets/icon/rating-song-mode/grid.svg";
    import listImg from "$lib/assets/icon/rating-song-mode/list.svg";
    import { getTheme } from "$lib/module/layout";

    interface Props {
        songRatingDatas: User.RatingData["songRatingDatas"];
    }

    let { songRatingDatas }: Props = $props();

    let top50 = $derived(songRatingDatas.slice(0, 50));
    let after50 = $derived(songRatingDatas.slice(50));

    let mode = $state<"grid" | "list">("grid");
    const theme = getTheme();

    function setMode(mode_: "grid" | "list") {
        mode = mode_;
    }
</script>

<div class="ratingsong-container">
    {@render mainHeading()}
    {@render top50Heading()}
    {#if mode === "grid"}
        <RatingSongGrid songRatingDatas={top50} />
    {:else}
        <RatingSongList songRatingDatas={top50} />
    {/if}
    <h2>이외의 곡</h2>
    {#if mode === "grid"}
        <RatingSongGrid songRatingDatas={after50} />
    {:else}
        <RatingSongList songRatingDatas={after50} />
    {/if}
</div>

{#snippet mainHeading()}
    <h1>
        <div class="left">곡 레이팅</div>
        <div class="right">
            <img
                class={`grid-img theme-${$theme}`}
                class:selected={mode === "grid"}
                src={gridImg}
                alt="grid"
                onclick={() => setMode("grid")}
            />
            <img
                class={`list-img theme-${$theme}`}
                class:selected={mode === "list"}
                src={listImg}
                alt="list"
                onclick={() => setMode("list")}
            />
        </div>
    </h1>
{/snippet}
{#snippet top50Heading()}
    <h2>
        <div class="left">상위 50곡</div>
        <div class="right download">다운로드</div>
    </h2>
{/snippet}

<style>
    .ratingsong-container {
        width: 100%;
    }

    h1 {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-block: 10px;

        & img {
            cursor: pointer;

            &.theme-light {
                filter: invert(60%);
                &:hover {
                    filter: invert(50%);
                }
                &.selected {
                    filter: invert(0%);
                }
            }
            &.theme-dark {
                filter: invert(40%);
                &:hover {
                    filter: invert(50%);
                }
                &.selected {
                    filter: invert(100%);
                }
            }
        }
        & .grid-img {
            width: 25px;
            height: 25px;
        }
        & .list-img {
            width: 30px;
            height: 30px;
        }
    }

    h2 {
        margin-block: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .left,
    .right {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        column-gap: 10px;
    }

    .download{
        font-size: 14px;
        cursor: pointer;
    }
</style>
