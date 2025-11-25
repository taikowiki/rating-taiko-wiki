<script lang="ts">
    import { getLang } from "$lib/module/layout";
    import { docTitle } from "$lib/module/docs";
    import { getI18n } from "$lib/module/i18n";

    const lang = getLang();
    let i18n = $derived(getI18n($lang));
    let docTitles = $derived(i18n.docs.titles);
</script>

<h1>
    {i18n.docs.doc}
</h1>
{#each docTitle as title, i}
    <div>
        <a href={`/docs/${title}`}>
            {docTitles[i]}
        </a>
    </div>
{/each}