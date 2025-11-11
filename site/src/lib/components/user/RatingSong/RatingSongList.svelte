<script lang="ts">
    import { User } from "$lib/module/user";

    interface Props {
        songRatingDatas: User.RatingData["songRatingDatas"];
    }

    let { songRatingDatas }: Props = $props();
</script>

