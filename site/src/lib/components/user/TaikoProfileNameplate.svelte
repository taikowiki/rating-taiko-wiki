<script lang="ts">
    import { getIsMobile, getTheme } from "$lib/module/layout";
    import type { User } from "$lib/module/user";
    import { COLOR, CONST } from "$lib/module/util";
    import { onMount } from "svelte";

    interface Props {
        nickname: string;
        taikoNo: string;
        dani: User.Dani | null;
    }

    let { nickname, taikoNo, dani }: Props = $props();

    let canvasElement = $state<HTMLCanvasElement>();
    onMount(async () => {
        if (!dani) return;
        const context = canvasElement?.getContext("2d");
        if (!canvasElement || !context) return;

        await new FontFace('Dela Gothic One', 'url(/font/Dela-Gothic-One.ttf)').load();

        const width = 500;
        const height = 500;
        canvasElement.width = width;
        canvasElement.height = height;

        // frame
        const frameOuterRadius = 200;
        const frameInnerRadius = 110;
        context.beginPath();
        context.arc(width / 2, height / 2, frameOuterRadius, 0, Math.PI * 2);
        context.moveTo(width / 2 + frameInnerRadius, height / 2);
        context.arc(
            width / 2,
            height / 2,
            frameInnerRadius,
            0,
            Math.PI * 2,
            true,
        );
        // fill
        const frameGradient = context.createLinearGradient(
            width / 2,
            height / 2 - frameOuterRadius,
            width / 2,
            height / 2 + frameOuterRadius,
        );
        frameGradient.addColorStop(0, COLOR.DANI.FRAME[dani.frame][0]);
        for (let i = 1; i < COLOR.DANI.FRAME[dani.frame].length - 1; i++) {
            frameGradient.addColorStop(
                i / (COLOR.DANI.FRAME[dani.frame].length - 2),
                COLOR.DANI.FRAME[dani.frame][i],
            );
        }
        frameGradient.addColorStop(
            1,
            COLOR.DANI.FRAME[dani.frame].at(-1) ?? "",
        );
        context.fillStyle = frameGradient;
        context.fill();
        // stroke
        context.strokeStyle = "black";
        context.lineWidth = 12;
        context.stroke();
        context.closePath();

        // text
        const textGradient = context.createLinearGradient(
            width / 2,
           ( height / 2 - frameOuterRadius) / 1.2,
            width / 2,
            (height / 2 + frameOuterRadius) / 1.2,
        );
        textGradient.addColorStop(0, COLOR.DANI.FRAME[dani.frame][0]);
        for (let i = 1; i < COLOR.DANI.FRAME[dani.frame].length - 1; i++) {
            textGradient.addColorStop(
                i / (COLOR.DANI.FRAME[dani.frame].length - 2),
                COLOR.DANI.FRAME[dani.frame][i],
            );
        }
        textGradient.addColorStop(
            1,
            COLOR.DANI.FRAME[dani.frame].at(-1) ?? "",
        );
        context.font = "230px 'Dela Gothic One'";
        context.fillStyle = dani.type === "red" ? "red" : "#ffb411";
        context.scale(1, 1.2);
        context.lineWidth = 30;
        context.strokeStyle = textGradient;
        context.strokeText(
            CONST.DANI.DAN_JPN[dani.dan][0],
            width * 0.035,
            height * 0.47,
        );
        context.fillText(
            CONST.DANI.DAN_JPN[dani.dan][0],
            width * 0.035,
            height * 0.47,
        );
        context.lineWidth = 12;
        context.strokeStyle = "black";
        context.strokeText(
            CONST.DANI.DAN_JPN[dani.dan][0],
            width * 0.035,
            height * 0.47,
        );
        context.lineWidth = 30;
        context.strokeStyle = textGradient;
        context.strokeText(
            CONST.DANI.DAN_JPN[dani.dan][1],
            width * 0.51,
            height * 0.7,
        );
        context.fillText(
            CONST.DANI.DAN_JPN[dani.dan][1],
            width * 0.51,
            height * 0.7,
        );
        context.lineWidth = 12;
        context.strokeStyle = "black";
        context.strokeText(
            CONST.DANI.DAN_JPN[dani.dan][1],
            width * 0.51,
            height * 0.7,
        );
    });

    const theme = getTheme();
    const isMobile = getIsMobile();
</script>

<div class={`container theme-${$theme}`}>
    {#if dani}
        <canvas bind:this={canvasElement}></canvas>
    {/if}
    <div class="taiko-profile">
        <div class="taikoNo">
            {taikoNo}
        </div>
        <div class="nickname">
            {nickname}
        </div>
    </div>
</div>

<style>
    .container {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        column-gap: 20px;

        padding-block: 10px;
        box-sizing: border-box;

        border-radius: 10px;

        &.theme-light {
            background-color: #cf4844;
        }
        &.theme-dark {
            background-color: #1c1c1c;
        }
    }

    .taiko-profile{
        display: flex;
        flex-direction: column;
        align-items: center;
        color: white;
    }
    .taikoNo{
        font-size: 13px;
    }
    .nickname{
        font-size: 30px;
        font-family: 'Mochiy Pop One';
        margin-top: -7px;
    }

    canvas {
        width: 80px;
        height: 80px;
    }
</style>
