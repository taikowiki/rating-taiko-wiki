<script lang="ts">
    import { getI18n } from "$lib/module/i18n/index.js";
    import { getLang, getTheme } from "$lib/module/layout";
    import { userRequestor } from "$lib/module/user/client.js";

    let { data } = $props();

    /**
     * @status `waiting, migrating, success, error`
     */
    let status = $state<0 | 1 | 2 | 3>(0);

    const theme = getTheme();
    const lang = getLang();
    let i18n = $derived(getI18n($lang).migrate);

    async function migrate() {
        status = 1;
        const result = await userRequestor.migrate();
        if (result.status === "success") {
            status = 2;
        } else {
            status = 3;
        }
    }
</script>

<div>
    {#if data.canMigrate}
        {#if status === 0}
            <div>{i18n.confirm}</div>
            <button class={`standard theme-${$theme}`} onclick={migrate}>
                {i18n.button}
            </button>
        {:else if status === 1}
            {i18n.migrating}
        {:else if status === 2}
            {i18n.success}
            {#if data.user}
                <a href={`/user/${data.user?.UUID}`}>{i18n.my_rating}</a>
            {/if}
        {:else}
            {i18n.success}
        {/if}
    {:else if data.reason === "RATING_DATA_ALREADY_EXISTS"}
        {i18n.already_exists}
    {:else}
        {i18n.not_possible}
    {/if}
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 10px;
    }
</style>
