<script lang="ts">
    import { User } from "$lib/module/user";
    import { getIsMobile, getTheme } from "$lib/module/layout";
    import white from "$lib/assets/icon/badge/white.png";
    import bronze from "$lib/assets/icon/badge/bronze.png";
    import silver from "$lib/assets/icon/badge/silver.png";
    import gold from "$lib/assets/icon/badge/gold.png";
    import pink from "$lib/assets/icon/badge/pink.png";
    import purple from "$lib/assets/icon/badge/purple.png";
    import rainbow from "$lib/assets/icon/badge/rainbow.png";

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
        badge: User.TaikoProfile["badge"];
    }

    let { badge }: Props = $props();

    const theme = getTheme();
</script>

<div class={`container theme-${$theme}`}>
    <div class="layer-1">
        {#each ["rainbow", "purple", "pink"] as User.Badge[] as badgeType}
            <div class="box">
                <img
                    class="badge-img"
                    src={badgeImg[badgeType] ?? ""}
                    alt={badgeType}
                />
                <div class="badge-count">
                    {badge[badgeType]}
                </div>
            </div>
        {/each}
    </div>
    <div class="layer-2">
        {#each ["gold", "silver", "bronze", "white"] as User.Badge[] as badgeType}
            <div class="box">
                <img
                    class="badge-img"
                    src={badgeImg[badgeType] ?? ""}
                    alt={badgeType}
                />
                <div class="badge-count">
                    {badge[badgeType]}
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .container {
        width: 100%;
        display: flex;
        flex-direction: column;

        padding-block: 10px;
        box-sizing: border-box;
        row-gap: 10px;

        border-radius: 10px;

        &.theme-light {
            background-color: #cf4844;
        }
        &.theme-dark {
            background-color: #1c1c1c;
        }
    }

    .layer-1, .layer-2{
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    .box {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        column-gap: 5px;
    }

    .badge-img {
        width: 30px;
        height: auto;
    }
    .badge-count {
        font-size: 18px;
        color: white;
        font-weight: bold;
        transform: translateY(-1px);
    }
</style>
