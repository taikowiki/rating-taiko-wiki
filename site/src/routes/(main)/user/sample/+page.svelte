<script lang="ts">
    import TaikoProfile from "$lib/components/user/TaikoProfile.svelte";

    let { data } = $props();
</script>

<TaikoProfile taikoProfile={data.taikoProfile} />
