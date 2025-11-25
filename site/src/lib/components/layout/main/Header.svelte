<script lang="ts">
    import { getIsMobile, getTheme } from "$lib/module/layout";
    import ThemeToggler from "./ThemeToggler.svelte";
    import logo from "$lib/assets/img/logo.png";
    import MobileSide from "./MobileSide.svelte";
    import { page } from "$app/state";
    import LangSelector from "./LangSelector.svelte";

    const theme = getTheme();
    const isMobile = getIsMobile();

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
                <span>랭킹</span>
            </a>
            <a class="navBtn" href="/docs">
                <span>문서</span>
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
                <span>내 레이팅</span>
            </a>
            <a class="navBtn" href="/me">
                <span>내 프로필</span>
            </a>
        {:else}
            <a
                class="navBtn"
                href={`//taiko.wiki/auth/login?redirect_to=${encodeURIComponent(page.url.toString())}`}
            >
                <span>로그인</span>
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
