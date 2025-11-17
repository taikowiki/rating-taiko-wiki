<script lang="ts">
    import { getTheme } from "$lib/module/layout";
    import { userRequestor } from "$lib/module/user/client.js";

    let { data } = $props();

    /**
     * @status `waiting, migrating, success, error`
     */
    let status = $state<0 | 1 | 2 | 3>(0);

    const theme = getTheme();

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
            <div>데이터 이전이 가능합니다. 이전하시겠습니까?</div>
            <button class={`standard theme-${$theme}`} onclick={migrate}>
                이전하기
            </button>
        {:else if status === 1}
            데이터 이전 중...
        {:else if status === 2}
            데이터 이전 성공!
            {#if data.user}
                <a href={`/user/${data.user?.UUID}`}>내 레이팅</a>
            {/if}
        {:else}
            데이터 이전 오류
        {/if}
    {:else if data.reason === "RATING_DATA_ALREADY_EXISTS"}
        이미 레이팅 데이터가 존재합니다.
    {:else}
        데이터 이전이 불가능합니다.
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
