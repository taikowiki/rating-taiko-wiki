<script lang="ts">
    import { getTheme } from "$lib/module/layout";
    import light from "$lib/assets/icon/theme/light.svg";
    import dark from "$lib/assets/icon/theme/dark.svg";

    const theme = getTheme();

    function toggleTheme() {
        if ($theme === "light") {
            $theme = "dark";
        } else {
            $theme = "light";
        }
    }
</script>

<div
    class={`container theme-${$theme}`}
    onclick={toggleTheme}
    role="presentation"
>
    <div class={`circle theme-${$theme}`}>
        <div class={`circle-img-container theme-${$theme}`}>
            <img class="circle-img dark" src={dark} alt="dark" />
            <img class="circle-img light" src={light} alt="light" />
        </div>
    </div>
</div>

<style>
    .container {
        width: 50px;
        height: 22px;
        border: 2px solid;
        border-radius: 12px;
        border-color: white;
        position: relative;
        background-color: white;
        cursor: pointer;

        &.theme-dark {
            border-color: #838383;
            background-color: #838383;
        }
    }

    .circle {
        width: 22px;
        height: 22px;
        border-radius: 11px;
        position: absolute;
        top: 0;

        overflow: hidden;

        transition:
            left 0.3s,
            color 0.3s;

        &.theme-light {
            background-color: #cf4844;
            left: 0;
        }
        &.theme-dark {
            background-color: #0f0f0f;
            left: calc(100% - 22px);
        }
    }

    .circle-img-container{
        display:flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        column-gap: 4px;
        
        position: absolute;
        margin-top: 2px;

        transition: left 0.2s;

        &.theme-dark{
            left: 2px;
        }
        &.theme-light{
            left: calc(100% - 42px);
        }
    }

    .circle-img{
        width: 18px;
        height: 18px;
        filter: invert(100%);
    }
</style>
