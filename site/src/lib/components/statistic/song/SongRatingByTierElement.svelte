<script lang="ts">
    import { getI18n } from "$lib/module/i18n";
    import { getLang, getTheme } from "$lib/module/layout";
    import type { User } from "$lib/module/user";
    import { Chart } from "chart.js/auto";
    import { onDestroy, onMount } from "svelte";

    interface Props {
        tierName: User.TierName;
        datas: number[];
        myData: User.SongRatingData | null;
        myTierName: User.TierName | null;
    }

    let { tierName, datas, myData, myTierName }: Props = $props();

    const { labels, datasets, yMax, xMax } = $derived(getChartData(datas));

    let canvas = $state<HTMLCanvasElement>();
    let unsubscriber = $state<() => void>();
    onMount(() => {
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        const tickColor = $theme === "light" ? "gray" : "white";
        const chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets,
            },
            options: {
                scales: {
                    x: { grid: { color: "gray" }, ticks: { color: tickColor } },
                    y: {
                        grid: { color: "gray" },
                        ticks: { color: tickColor, stepSize: 1 },
                        min: 0,
                        max: yMax + 1,
                    },
                },
                //responsive: false
                maintainAspectRatio: false,
            },
        });
        unsubscriber = theme.subscribe((value) => {
            if (chart.options) {
                if (chart.options.scales?.x?.ticks) {
                    chart.options.scales.x.ticks.color =
                        value === "light" ? "gray" : "white";
                }
                if (chart.options.scales?.y?.ticks) {
                    chart.options.scales.y.ticks.color =
                        value === "light" ? "gray" : "white";
                }
            }
            chart.update();
        });
    });
    onDestroy(() => {
        unsubscriber?.();
    });
    const AVG = $derived(getAVG());
    const SD = $derived(getSD());

    function getChartData(datas_: number[]) {
        const step = 100;

        const datas = new Map<number, number>();
        datas_.forEach((data) => {
            const floored = Math.floor(data / step) * step;
            datas.set(floored, (datas.get(floored) ?? 0) + 1);
        });

        const sorted = [...datas].toSorted(([a], [b]) => a - b);
        const xMin = sorted[0][0];
        const xMax = sorted[sorted.length - 1][0];
        let yMax = 0;
        const labels: number[] = [];
        for (let i = xMin; i <= xMax; i += step) {
            labels.push(i);
        }
        const data: number[] = [];
        labels.forEach((l) => {
            const y = datas.get(l);
            data.push(y ?? 0);
            if (y && y > yMax) {
                yMax = y;
            }
        });

        const flooredMine = myData?.ratingScore
            ? Math.floor(myData.ratingScore / step) * step
            : null;
        const backgroundColor = labels.map((l) => {
            if (l === flooredMine && tierName === myTierName) {
                return "#f97316";
            }
            return "#0d9488";
        });

        return {
            labels,
            datasets: [
                {
                    label: `Number of people (step: ${step})`,
                    data,
                    backgroundColor,
                },
            ],
            yMax,
            xMax
        };
    }
    function getAVG() {
        let SUM = 0;
        datas.forEach((data) => {
            SUM += data;
        });
        return SUM / datas.length;
    }
    function getSD() {
        const AVG = getAVG();
        let deviationSquareSum = 0;
        datas.forEach((data) => {
            deviationSquareSum += (data - AVG) ** 2;
        });
        return Math.sqrt(deviationSquareSum / datas.length);
    }

    const lang = getLang();
    const i18n = $derived(getI18n($lang));
    const theme = getTheme();
</script>

{#if xMax > 0}
    <div class="container">
        <h3>
            {tierName.capitalize()}
        </h3>
        <div class="canvas-container">
            <canvas bind:this={canvas}></canvas>
        </div>
        <div class="figures-container">
            <div>x̅: {AVG.toFixed(2)}</div>
            <div>σ: {SD.toFixed(2)}</div>
        </div>
    </div>
{/if}

<style>
    h3 {
        margin-block: 3px;
    }
    .canvas-container {
        width: 100%;
        overflow-x: auto;
    }

    .figures-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        column-gap: 10px;
        font-weight: bold;
    }

    canvas {
        min-width: 100%;
    }
</style>
