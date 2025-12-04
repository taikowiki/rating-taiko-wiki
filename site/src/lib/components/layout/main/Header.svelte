<script lang="ts">
    import { getIsMobile, getLang, getTheme } from "$lib/module/layout";
    import ThemeToggler from "./ThemeToggler.svelte";
    import logo from "$lib/assets/img/logo.png";
    import MobileSide from "./MobileSide.svelte";
    import { page } from "$app/state";
    import LangSelector from "./LangSelector.svelte";
    import { getI18n } from "$lib/module/i18n";

    const theme = getTheme();
    const isMobile = getIsMobile();
    const lang = getLang();
    const i18n = $derived(getI18n($lang).header);

    let mobileSideOpened = $state(false);
    function toggleMobileSide() {
        mobileSideOpened = !mobileSideOpened;
    }
</script>

<header class={`theme-${$theme}`} class:isMobile={$isMobile}>
    <div class="left" class:isMobile={$isMobile}>
        <a class="logo" href="/">
            <img class="logo" src={logo} alt="logo" />
        </a>
        {#if !$isMobile}
            <a class="navBtn" href="/ranking">
                <span>{i18n.ranking}</span>
            </a>
            <a class="navBtn" href="/docs">
                <span>{i18n.docs}</span>
            </a>
            <a class="navBtn" href="/statistic">
                <span>{i18n.statistics}</span>
            </a>
            <a class="navBtn" href="/measure">
                <span>{i18n.measure}</span>
            </a>
        {/if}
    </div>
    <div class="right" class:isMobile={$isMobile}>
        {@render userView()}
        {#if !$isMobile}
            <LangSelector />
        {/if}
        <ThemeToggler />
        {#if $isMobile}
            {@render sideBtn()}
            <MobileSide bind:mobileSideOpened />
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
{#snippet userView()}
    {#if !$isMobile}
        {#if page.data.user}
            <a class="navBtn" href="/myrating">
                <span>{i18n.my_rating}</span>
            </a>
            <a class="navBtn" href="/me">
                <span>{i18n.my_profile}</span>
            </a>
        {:else}
            <a
                class="navBtn"
                href={`//taiko.wiki/auth/login?redirect_to=${encodeURIComponent(page.url.toString())}`}
            >
                <span>{i18n.login}</span>
            </a>
        {/if}
    {/if}
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

        &.isMobile {
            column-gap: 10px;
        }
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

    a.navBtn {
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 2px;

        color: white;
        font-weight: bold;

        cursor: pointer;
        box-sizing: border-box;
        padding-block: 2px;
        padding-inline: 5px;
        border-radius: 5px;

        &:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        & span {
            transform: translateY(-1px);
        }
        /*
        & .icon {
            width: 20px;
            height: 20px;
            &.invert {
                filter: invert(100%);
            }
        }
        */
    }
</style>
