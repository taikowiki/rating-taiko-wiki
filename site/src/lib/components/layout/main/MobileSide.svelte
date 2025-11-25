<script lang="ts">
    import { afterNavigate, goto } from "$app/navigation";
    import { page } from "$app/state";
    import { getI18n } from "$lib/module/i18n";
    import { getIsMobile, getLang, getProfile, getTheme } from "$lib/module/layout";
    import LangSelector from "./LangSelector.svelte";

    interface Props {
        mobileSideOpened: boolean;
    }

    let { mobileSideOpened = $bindable() }: Props = $props();

    afterNavigate(() => {
        if (mobileSideOpened) {
            mobileSideOpened = false;
        }
    });

    let swipeData = $state<{
        from: [number, number] | null;
        to: [number, number] | null;
    }>({ from: null, to: null });
    $effect(() => {
        if (!mobileSideOpened) {
            swipeData = { from: null, to: null };
        }
    });
    function touchStart(event: TouchEvent) {
        if (!mobileSideOpened) return;
        swipeData.from = [event.touches[0].clientX, event.touches[0].clientY];
    }
    function touchEnd(event: TouchEvent) {
        if (!mobileSideOpened || !swipeData.from) return;
        swipeData.to = [
            event.changedTouches[0].clientX,
            event.changedTouches[0].clientY,
        ];

        const diffX = swipeData.to[0] - swipeData.from[0];
        const diffY = swipeData.to[1] - swipeData.from[1];

        if (diffX > 80 && Math.abs(diffY) < 80) {
            toggleMobileSide();
        }
    }

    const isMobile = getIsMobile();
    const theme = getTheme();
    const profile = getProfile();
    const lang = getLang();
    const i18n = $derived(getI18n($lang).header);

    function toggleMobileSide() {
        mobileSideOpened = !mobileSideOpened;
    }
</script>

<svelte:window ontouchstart={touchStart} ontouchend={touchEnd} />

<div
    class="mobileside-background"
    class:show={$isMobile && mobileSideOpened}
    onclick={toggleMobileSide}
></div>

<div
    class={`mobileside theme-${$theme}`}
    class:show={$isMobile && mobileSideOpened}
>
    {@render userView()}
    <a class="navBtn" href={`/myrating`}>
        <span>{i18n.my_rating}</span>
    </a>
    <a class="navBtn" href={`/me`}>
        <span>{i18n.my_profile}</span>
    </a>
    <a class="navBtn" href={`/ranking`}>
        <span>{i18n.ranking}</span>
    </a>
    <a class="navBtn" href={`/docs`}>
        <span>{i18n.docs}</span>
    </a>
    <LangSelector />
</div>

{#snippet userView()}
    {#if $profile}
        <h2>
            {$profile.nickname}
            <div class="btn-container">
                <button
                    class="standard"
                    onclick={() =>
                        (window.location.href = "//taiko.wiki/auth/logout")}
                >
                    {i18n.logout}
                </button>
                <button class="standard" onclick={toggleMobileSide}>
                    {i18n.close}
                </button>
            </div>
        </h2>
    {:else}
        <a
            class="navBtn"
            href={`//taiko.wiki/auth/login?redirect_to=${encodeURIComponent(page.url.href)}`}
        >
            <span>{i18n.login}</span>
        </a>
    {/if}
{/snippet}

<style>
    .mobileside-background {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100vw;
        height: 100vh;

        background-color: rgba(0, 0, 0, 0.5);

        &:not(.show) {
            display: none;
        }
    }

    .mobileside {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 101;
        width: 250px;
        max-width: 100vw;
        height: 100vh;
        padding: 10px;
        box-sizing: border-box;

        transition: transform 0.2s;

        &.theme-light {
            background-color: white;
        }
        &.theme-dark {
            background-color: #282828;
        }

        &:not(.show) {
            transform: translateX(100%);
        }
    }

    h2 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        column-gap: 5px;
        row-gap: 5px;
        margin-bottom: 20px;

        & .btn-container {
            flex: 1 0 auto;
            display: flex;
            column-gap: 5px;
            align-items: center;
            justify-content: flex-end;
        }
    }

    a.navBtn {
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 2px;
        color: inherit;

        cursor: pointer;
        box-sizing: border-box;
        padding-block: 5px;
        padding-inline: 5px;

        &:not(:nth-last-child(1)) {
            border-bottom: 1px solid gray;
        }

        & span {
            transform: translateY(-1px);
        }
        & .icon {
            width: 20px;
            height: 20px;
            &.invert {
                filter: invert(100%);
            }
        }
    }
</style>
