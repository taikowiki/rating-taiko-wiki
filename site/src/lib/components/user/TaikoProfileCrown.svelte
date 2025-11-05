<script lang="ts">
    import type { User } from "$lib/module/user";
    import donderfull from "$lib/assets/icon/crown/dfc.svg";
    import gold from "$lib/assets/icon/crown/fc.svg";
    import silver from "$lib/assets/icon/crown/clear.svg";
    import { getIsMobile, getTheme } from "$lib/module/layout";

    const crownImg = {
        donderfull,
        gold,
        silver,
    };

    interface Props {
        crown: User.TaikoProfile["crown"];
    }

    let { crown }: Props = $props();

    const theme = getTheme();
</script>

<div class={`container theme-${$theme}`}>
    {#each ["donderfull", "gold", "silver"] as const as crownType}
        <div class="box">
            <img class="crown-img" src={crownImg[crownType]} alt={crownType} />
            <div class="crown-count">{crown[crownType]}</div>
        </div>
    {/each}
</div>

<style>
    .container {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;

        padding-block: 10px;
        box-sizing: border-box;

        border-radius: 10px;

        &.theme-light {
            background-color: #cf4844;
        }
        &.theme-dark {
            background-color: #1c1c1c;
        }
    }

    .box {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        column-gap: 5px;
    }

    .crown-img {
        width: 30px;
        height: auto;
    }
    .crown-count {
        font-size: 18px;
        color: white;
        font-weight: bold;
        transform: translateY(-1px);
    }
</style>
