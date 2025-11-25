<script lang="ts">
    import donchan_constructing from '$lib/assets/img/donchan/constructing.png';
    import { getI18n } from '$lib/module/i18n';
    import { getLang } from '$lib/module/layout';

    const lang = getLang();
    const i18n = $derived(getI18n($lang).main)
</script>

<div class="container">
    <img src={donchan_constructing} alt="WIP">
    {i18n.WIP}
</div>

<style>
    .container{
        display:flex;
        flex-direction: column;
        align-items: center;

        font-size: 20px;
    }
    img{
        width: 100%;
        max-width: 300px;
    }
</style>