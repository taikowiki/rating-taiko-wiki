<script lang="ts">
    import "$lib/assets/css/standard.scss";
    import "$lib/assets/css/main.scss";
    import Favicon from "$lib/components/layout/main/Favicon.svelte";
    import Header from "$lib/components/layout/main/Header.svelte";
    import Meta from "$lib/components/layout/main/Meta.svelte";
    import {
        getTheme,
        initIsMobile,
        initTheme,
        setProfile,
        setTimezone,
        initLang,
        getLang,
    } from "$lib/module/layout/index.js";
    import { navigating } from "$app/state";
    import loading from "$lib/assets/icon/loading.svg";
    import GoogleTag from "$lib/components/layout/main/GoogleTag.svelte";

    let { children, data } = $props();

    initTheme(data.theme);
    initIsMobile(data.isMobile);
    setTimezone(data.timezone);
    setProfile(data.user?.profile);
    initLang(data.lang);

    const theme = getTheme();
    const lang = getLang();
</script>

<Meta />
<GoogleTag gtm={data.gtm} gtag={data.gtag} pubId={data.gpubId} user={data.user}/>
<Favicon />
<Header />
{#if navigating.type}
    <div class="loading-container">
        <img class="loading" src={loading} alt="loading" />
    </div>
{/if}
<main class={`theme-${$theme}`} class:hide={Boolean(navigating.type)}>
    {@render children()}
</main>

<style>
    main {
        width: 100%;
        max-width: 1020px;
        padding-inline: 10px;
        padding-block: 10px;
        box-sizing: border-box;
        margin-left: auto;
        margin-right: auto;
        &.hide {
            display: none;
        }
    }

    .loading-container {
        width: 100%;
        text-align: center;
    }
    .loading {
        width: 100%;
        max-width: 200px;
    }
</style>
