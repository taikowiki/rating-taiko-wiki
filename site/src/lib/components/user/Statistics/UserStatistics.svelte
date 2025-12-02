<script lang="ts">
    import { User } from "$lib/module/user";
    import Top50Statistics from "./Top50Statistics.svelte";
    import RatingHistory from "./RatingHistory.svelte";
    import { getLang } from "$lib/module/layout";
    import { getI18n } from "$lib/module/i18n";

    interface Props {
        top50: User.SongRatingData[];
        ratingScoreHistory: User.RatingData["ratingScoreHistory"];
    }

    const lang = getLang();
    const i18n = $derived(getI18n($lang).user_page);

    let { top50, ratingScoreHistory }: Props = $props();
</script>

<h1>{i18n.statistics.title}</h1>
<Top50Statistics {top50} />
{#if ratingScoreHistory.length}
    <RatingHistory {ratingScoreHistory} />
{/if}

<style>
    h1 {
        width: 100%;
    }
</style>
