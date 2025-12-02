<script lang="ts">
    import { getI18n } from "$lib/module/i18n";
    import { getLang, getTheme } from "$lib/module/layout";
    import type { User } from "$lib/module/user";
    import { CONST } from "$lib/module/util";
    import { Chart } from "chart.js/auto";
    import { onDestroy, onMount } from "svelte";

    interface Props {
        dan: (typeof CONST.DANI.NIJIIRO_REGULAR_DAN)[number];
        datas: {
            currentRatingScore: number;
            dan: User.Dani["dan"];
            danType: "red" | "gold";
        }[];
        myRatingData?: User.RatingData;
        myTaikoProfile?: User.TaikoProfile;
    }

    let { dan, datas, myRatingData, myTaikoProfile }: Props = $props();
    const xStep = 100;
    const flooredDatas = $derived(
        datas.map((data) => ({
            dan: data.dan,
            danType: data.danType,
            currentRatingScore:
                Math.floor(data.currentRatingScore / xStep) * xStep,
        })),
    );
    const labels = $derived.by(() => {
        let min = Infinity;
        let max = 0;
        flooredDatas.forEach((data) => {
            if (min > data.currentRatingScore) {
                min = data.currentRatingScore;
            }
            if (max < data.currentRatingScore) {
                max = data.currentRatingScore;
            }
        });

        const labels: number[] = [];
        for (let i = min; i <= max; i += xStep) {
            labels.push(i);
        }

        return labels;
    });
    const datasets = $derived.by(() => {
        const data: number[] = [];
        Object.values(flooredDatas).forEach(({ currentRatingScore }) => {
            const index = labels.indexOf(currentRatingScore);
            if (!data[index]) {
                data[index] = 0;
            }
            data[index]++;
        });

        const floored =
            myRatingData && myTaikoProfile?.dani?.dan === dan
                ? Math.floor(myRatingData.currentRatingScore / xStep) * xStep
                : null;
        const backgroundColor = data.map((_, i) => {
            if (labels[i] === floored) {
                return "#f97316";
            }
            return "#0d9488";
        });

        return [
            {
                label: "Number of people",
                data,
                backgroundColor,
            },
        ];
    });
    const max = $derived.by(() => {
        let max = 0;
        datasets[0].data.forEach((v) => {
            if (v > max) max = v;
        });
        return max;
    });
    const AVG = $derived(getAVG());
    const SD = $derived(getSD());

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
                        min: 0,
                        max: Math.max(5, max + 1),
                        grid: { color: "gray" },
                        ticks: { color: tickColor, stepSize: 1 },
                    },
                },
                responsive: false
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

    const theme = getTheme();
    const lang = getLang();
    const i18n = $derived(getI18n($lang));

    function getSUM() {
        return datas.reduce((a, c) => a + c.currentRatingScore, 0);
    }
    function getAVG() {
        return getSUM() / datas.length;
    }
    function getSD() {
        const AVG = getAVG();
        let deviationSquareSum = 0;
        for (let x = 0; x < datas.length; x++) {
            deviationSquareSum += (datas[x].currentRatingScore - AVG) ** 2;
        }
        return Math.sqrt(deviationSquareSum / datas.length);
    }
</script>

<div class="container">
    <h3>
        {i18n.dani[dan]}
    </h3>
    <div class="canvas-container">
        <canvas bind:this={canvas}></canvas>
    </div>
    <div class="figures-container">
        <div>x̅: {AVG.toFixed(2)}</div>
        <div>σ: {SD.toFixed(2)}</div>
    </div>
</div>

<style>
    h3{
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

    canvas{
        min-width: 100%;
    }
</style>
