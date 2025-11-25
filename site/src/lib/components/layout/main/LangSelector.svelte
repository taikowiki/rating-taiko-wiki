<script lang="ts">
    import { LANG, LANG_NAME } from "$lib/module/i18n";
    import { getLang, getTheme } from "$lib/module/layout";

    const lang = getLang();
    let langState = $state($lang);
    $effect(() => {
        $lang = langState;
    });

    const theme = getTheme();
</script>

<select bind:value={langState} class={`standard theme-${$theme}`}>
    {#each LANG as lang}
        <option value={lang}>
            {LANG_NAME[lang]}
        </option>
    {/each}
</select>
