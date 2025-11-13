<script lang="ts">
    import { getTheme } from "$lib/module/layout";
    import type { User } from "$lib/module/user";
    import { Chart } from "chart.js/auto";
    import { onDestroy, onMount } from "svelte";
    import { type Unsubscriber } from "svelte/store";

    // Coefficient of Determination
    interface Props {
        top50: User.SongRatingData[];
    }

    let { top50 }: Props = $props();
    let canvas = $state<HTMLCanvasElement>();
    let unsubscriber = $state<Unsubscriber>();

    let LSL = $derived(getLSL());
    let CoD = $derived(getCoD(LSL));
    let SUM = $derived(top50.reduce((p, a) => p + a.ratingScore, 0));
    let AVG = $derived(SUM / top50.length);
    let SD = $derived(getSD(AVG));
    //let SSE = $derived();
    onMount(() => {
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;
        Chart.defaults.borderColor = 'gray';
        const chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: top50.map(
                    (r) => r.title + (r.difficulty === "ura" ? " (裏)" : ""),
                ),
                datasets: [
                    {
                        label: "Song rating score",
                        data: top50.map((r) => r.ratingScore),
                        borderColor: "skyblue",
                    },
                    {
                        label: "Least squares line",
                        data: top50.map((_, x) => LSL.a * x + LSL.b),
                        pointRadius: 0,
                        borderColor: "deeppink",
                    },
                ],
            },
            options: {
                responsive: false,
                backgroundColor: $theme === "light" ? 'white' : '#282828',
                color: $theme === "light" ? "black" : "white"
            },
        });
        unsubscriber = theme.subscribe((value) => {
            if (chart.options) {
                chart.options.color = value === "light" ? "black" : "white";
                if (chart.options.scales?.x?.ticks) {
                    chart.options.scales.x.ticks.color &&=
                        value === "light" ? "black" : "white";
                }
                if (chart.options.scales?.y?.ticks) {
                    chart.options.scales.y.ticks.color =
                        value === "light" ? "black" : "white";
                }
                chart.options.backgroundColor = value === "light" ? 'white' : '#282828';
            }
            chart.update();
        });
    });
    onDestroy(() => {
        unsubscriber?.();
    });

    /**
     * 최소 제곱 직선 계수 구하기
     */
    function getLSL() {
        let x_avg = (top50.length - 1) / 2;
        let y_avg = top50.reduce((p, c) => p + c.ratingScore, 0) / top50.length;

        let a_numerator = 0;
        let a_denominator = 0;
        for (let x = 0; x < top50.length; x++) {
            a_numerator += (x - x_avg) * (top50[x].ratingScore - y_avg);
            a_denominator += (x - x_avg) ** 2;
        }

        const a = a_numerator / a_denominator;
        const b = y_avg - a * x_avg;

        return { a, b, x_avg, y_avg };
    }

    /**
     * 결정 계수 구하기
     */
    function getCoD({ a, b, y_avg }: { a: number; b: number; y_avg: number }) {
        let SSE = 0;
        let SST = 0;
        for (let x = 0; x < top50.length; x++) {
            SSE += (top50[x].ratingScore - (a * x + b)) ** 2;
            SST += (top50[x].ratingScore - y_avg) ** 2;
        }

        return 1 - (SSE / SST);
    }

    /**
     * 표준편차 구하기
     */
    function getSD(AVG: number) {
        let variance = 0;
        for (let x = 0; x < top50.length; x++) {
            variance += (top50[x].ratingScore - AVG) ** 2;
        }
        return Math.sqrt(variance / top50.length);
    }

    /**
     * SSE 구하기
     */
    function getSSE({ a, b }: { a: number; b: number }) {
        let SSE = 0;
        for (let x = 0; x < top50.length; x++) {
            SSE += (top50[x].ratingScore - (a * x + b)) ** 2;
        }
    }

    const theme = getTheme();
</script>

<h2>상위 50곡</h2>
<div class="canvas-container">
    <canvas bind:this={canvas} width={`${top50.length * 30}px`} height="500px"></canvas>
</div>
<div class="figure-container">
    <div class="figure">
        Ø: {AVG.toFixed(2)}
    </div>
    <div class="figure">
        σ: {SD.toFixed(2)}
    </div>
    <div class="figure">
        R<sup>2</sup>: {CoD.toFixed(2)}
    </div>
</div>

<style>
    h2 {
        width: 100%;
    }

    .canvas-container {
        width: 100%;
        overflow-x: auto;
    }

    .figure-container {
        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 20px;
        flex-wrap: wrap;
    }
    .figure {
        font-weight: bold;
    }
</style>
