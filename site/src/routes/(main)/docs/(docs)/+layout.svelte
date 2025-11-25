<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import PageTitle from "$lib/components/layout/main/Page-title.svelte";
    import { docTitle } from "$lib/module/docs";
    import { getI18n } from "$lib/module/i18n";
    import { getLang, getTheme } from "$lib/module/layout";

    let { children } = $props();

    const theme = getTheme();
    const lang = getLang();
    let i18n = $derived(getI18n($lang));
    let docTitles = $derived(i18n.docs.titles);
    let title = $state(page.params.title);
    $effect(() => {
        goto(`/docs/${title}`);
    });
</script>

<PageTitle title={docTitles[docTitle.indexOf(title as any)] ?? ''}/>
<select bind:value={title} class={`standard theme-${$theme}`}>
    {#each docTitle as title, i}
        <option value={title}>
            {docTitles[i]}
        </option>
    {/each}
</select>
<div class="content">
    {@render children()}
</div>
{#if $lang !== "ko"}
    <div class="ai-trans">
        {i18n.docs.translated_by_ai}
    </div>
{/if}

<style>
    .content {
        margin-top: 10px;
        & :global(pre > code) {
            white-space: normal;
            overflow-wrap: anywhere;
        }
    }

    select {
        width: 100%;
        height: 30px;
    }

    .ai-trans{
        font-size: 13px;
        color: gray;
        margin-top: 30px;
    }
</style>
