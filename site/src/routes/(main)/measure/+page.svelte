<script lang="ts">
    import MeasureTable from "$lib/components/measure/MeasureTable.svelte";
    import { getI18n } from "$lib/module/i18n/index.js";
    import { getLang } from "$lib/module/layout/index.js";

    let { data } = $props();

    const lang = getLang();
    const i18n = $derived(getI18n($lang).measure);
</script>

<h1>{i18n.title}</h1>
<MeasureTable measures={data.measures} songTitleMap={data.songTitleMap}/>
