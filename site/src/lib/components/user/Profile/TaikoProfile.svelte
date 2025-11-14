<script lang="ts">
    import type { User } from "$lib/module/user";
    import TaikoProfileBadge from "./TaikoProfileBadge.svelte";
    import TaikoProfileCrown from "./TaikoProfileCrown.svelte";
    import TaikoProfileNameplate from "./TaikoProfileNameplate.svelte";


    interface Props {
        taikoProfile: User.TaikoProfile;
    }

    let { taikoProfile }: Props = $props();
</script>

<div class="container">
    <img class="mydon" src={`https://img.taiko-p.jp/imgsrc.php?v=&kind=mydon&fn=mydon_${taikoProfile.taikoNo}`} alt="mydon">
    <TaikoProfileNameplate {...taikoProfile}/>
    <TaikoProfileCrown crown={taikoProfile.crown}/>
    <TaikoProfileBadge badge={taikoProfile.badge}/>
</div>

<style>
    .container{
        width: 100%;

        display:flex;
        flex-direction: column;
        row-gap: 10px;
        align-items: center;
    }

    .mydon{
        width: calc(100% / 2);
        max-width: 200px;
        height: auto;
    }
</style>