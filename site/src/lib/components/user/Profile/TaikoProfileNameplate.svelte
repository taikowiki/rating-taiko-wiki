<script lang="ts">
    import { getIsMobile, getTheme } from "$lib/module/layout";
    import type { User } from "$lib/module/user";
    import { COLOR, CONST } from "$lib/module/util";
    import { createDaniImage } from "$lib/module/util/client";
    import { onMount } from "svelte";

    interface Props {
        nickname: string;
        taikoNo: string;
        dani: User.Dani | null;
    }

    let { nickname, taikoNo, dani }: Props = $props();

    let daniImgSrc = $state<string>();
    onMount(async () => {
        if (!dani) return;

        const cacheKey = `${dani.dan}|${dani.type}|${dani.frame}`;
        const cached = window.localStorage.getItem(cacheKey);
        if (cached) {
            daniImgSrc = cached;
            return;
        }

        const canvasElement = document.createElement("canvas");
        const context = canvasElement?.getContext("2d");
        if (!canvasElement || !context) return;

        daniImgSrc = await createDaniImage({ canvasElement, context, dani });
        window.localStorage.setItem(
            `${dani.dan}|${dani.type}|${dani.frame}`,
            daniImgSrc,
        );
    });

    const theme = getTheme();
</script>

<a
    class={`container theme-${$theme}`}
    href={`https://donderhiroba.jp/user_profile.php?taiko_no=${taikoNo}`}
    target="_blank"
>
    {#if dani}
        {#if daniImgSrc}
            <img class="dani-img" src={daniImgSrc} alt="dani" />
        {:else}
            <div class="dani-img"></div>
        {/if}
    {/if}
    <div class="taiko-profile">
        <div class="taikoNo">
            {taikoNo}
        </div>
        <div class="nickname">
            {nickname}
        </div>
    </div>
</a>

<style>
    .container {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        column-gap: 30px;

        padding-block: 10px;
        box-sizing: border-box;

        border-radius: 10px;

        text-decoration: none;

        &.theme-light {
            background-color: #cf4844;
        }
        &.theme-dark {
            background-color: #0f0f0f;
        }
    }

    .taiko-profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: white;
    }
    .taikoNo {
        font-size: 13px;
    }
    .nickname {
        font-size: 30px;
        font-family: "Mochiy Pop One";
        margin-top: -7px;
    }

    .dani-img {
        width: 80px;
        height: 80px;
    }
</style>
