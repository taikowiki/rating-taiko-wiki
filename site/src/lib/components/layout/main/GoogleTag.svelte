<script>
    import { browser } from "$app/environment";
    import { afterNavigate } from "$app/navigation";
    import { onMount } from "svelte";

    /**@type {{gtm: string, gtag: string, pubId: string, user: {UUID: string} | null}}*/ let {
        gtm,
        gtag,
        pubId,
        user,
    } = $props();

    onMount(() => {
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != "dataLayer" ? "&l=" + l : "";
            j.async = true;
            j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, "script", "dataLayer", gtm);
    });

    afterNavigate((nav) => {
        window.gtag?.('set', gtag, {
            user_id: user?.UUID ?? "null",
            uuid: user?.UUID ?? "null"
        })
        window.gtag?.('set', 'uuid', {
            uuid: user?.UUID ?? "null"
        })
        window.gtag?.("config", gtag, {
            page_title: document.title,
            page_path: nav.to.url.pathname,
            user_id: user?.UUID ?? "null",
            uuid: user?.UUID ?? "null"
        });
    });
</script>

<svelte:head>
    <meta name="google-adsense-account" content={pubId} />
    <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
        crossorigin="anonymous"
    ></script>
    <!---->
    <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag}`}
    ></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        window.gtag = gtag;
        gtag("js", new Date());
    </script>
</svelte:head>
