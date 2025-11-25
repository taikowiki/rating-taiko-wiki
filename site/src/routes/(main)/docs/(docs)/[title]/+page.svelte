<script lang="ts">
    import { page } from "$app/state";
    import { docContent, docImgs } from "$lib/module/docs";
    import { getLang } from "$lib/module/layout";
    import * as marked from "marked";
    import { parseHTML, serializeHTML } from "$lib/module/util";
    import path from "path-browserify";
    import PageTitle from "$lib/components/layout/main/Page-title.svelte";

    const lang = getLang();
    let content = $derived(docContent[$lang]?.[page.params.title ?? ""]?.toString() ?? "");
    let parsed = $derived(parseMarkdown(content));

    function parseMarkdown(md: string) {
        let parsed = marked.parse(md, { async: false });
        const dom = parseHTML(parsed);
        dom.querySelectorAll("img").forEach((e) => {
            const src = e.getAttribute("src");
            if (src) {
                const img = docImgs[path.basename(src)]?.default;
                if (img) {
                    e.setAttribute("src", img);
                }
            }
        });
        dom.querySelectorAll('a').forEach((e) => {
            e.setAttribute('target', '_blank')
        })
        parsed = serializeHTML(dom);
        return parsed;
    }
</script>

{@html parsed}