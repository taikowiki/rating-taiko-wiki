<script lang="ts">
    import { getIsMobile, getTheme } from "$lib/module/layout";
    import ThemeToggler from "./ThemeToggler.svelte";
    import logo from "$lib/assets/img/logo.png";
    import MobileSide from "./MobileSide.svelte";

    const theme = getTheme();
    const isMobile = getIsMobile();

    let mobileSideOpened = $state(false);
    function toggleMobileSide() {
        mobileSideOpened = !mobileSideOpened;
    }
</script>

<header class={`theme-${$theme}`} class:isMobile={$isMobile}>
    <div class="left">
        <img class="logo" src={logo} alt="logo" />
    </div>
    <div class="right">
        <ThemeToggler />
        {#if $isMobile}
            {@render sideBtn()}
            {#if mobileSideOpened}
                <MobileSide />
            {/if}
        {/if}
    </div>
</header>

{#snippet sideBtn()}
    <div class="hamburger" role="presentation" onclick={toggleMobileSide}>
        <div class={`bar theme-${$theme}`}></div>
        <div class={`bar theme-${$theme}`}></div>
        <div class={`bar theme-${$theme}`}></div>
    </div>
{/snippet}

<style>
    header {
        width: 100%;
        height: 50px;

        box-sizing: border-box;
        padding-inline: 40px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        &.theme-light {
            background-color: #cf4844;
        }
        &.theme-dark {
            background-color: #332e2e;
        }
        &.isMobile {
            padding-inline: 20px;
        }
    }

    .left,
    .right {
        display: flex;
        justify-content: center;
        align-items: center;

        column-gap: 10px;
    }

    .logo {
        width: 30px;
        height: 30px;
    }

    .hamburger {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;

        width: 30px;
        height: 25px;

        & .bar {
            width: 100%;
            height: 4px;
            border-radius: 2px;

            &.theme-light {
                background-color: white;
            }
            &.theme-dark {
                background-color: #bcbcbc;
            }
        }
    }
</style>
