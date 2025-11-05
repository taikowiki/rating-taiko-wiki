<script lang="ts">
    import Profile from "$lib/components/user/Profile.svelte";
    import { getIsMobile } from "$lib/module/layout/index.js";

    let { data } = $props();

    const isMobile = getIsMobile();
</script>

<div class="container">
    <Profile
        profile={data.profile}
        taikoProfile={data.taikoProfile}
        lastUpdate={data.ratingData.lastUpload}
    />
</div>

<style>
    .container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
