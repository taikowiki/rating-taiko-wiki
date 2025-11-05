<script lang="ts">
    import "$lib/assets/css/standard.scss";
    import Favicon from "$lib/components/layout/main/Favicon.svelte";
    import Header from "$lib/components/layout/main/Header.svelte";
    import Meta from "$lib/components/layout/main/Meta.svelte";
    import { getTheme, initIsMobile, initTheme } from "$lib/module/layout/index.js";

    let { children, data } = $props();

    initTheme(data.theme);
    initIsMobile(data.isMobile);

    const theme = getTheme();
</script>

<Meta />
<Favicon />
<Header />
<main class={`theme-${$theme}`}>
    {@render children()}
</main>

<style>
    main{
        padding: 5px;
    }
</style>