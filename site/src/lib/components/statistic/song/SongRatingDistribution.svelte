<script lang="ts">
    import { getI18n } from "$lib/module/i18n";
    import { getLang, getTheme } from "$lib/module/layout";
    import type { User } from "$lib/module/user";
    import { Chart } from "chart.js/auto";
    import { onDestroy, onMount } from "svelte";

    interface Props {
        statisticData: {
            songRatingData: User.SongRatingData;
            ratingData: Omit<User.RatingData, "scoreData" | "songRatingDatas">;
        }[];
        myData: User.SongRatingData | null;
    }

    let { statisticData, myData }: Props = $props();
    const { labels, datasets } = $derived(getChartData(statisticData, myData));

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

    const theme = getTheme();

    function getChartData(
        statisticData: Props["statisticData"],
        myData: Props["myData"],
    ) {
        const step = 200;

        const datas = new Map<number, number>();
        statisticData.forEach(({ songRatingData }) => {
            const floored =
                Math.floor(songRatingData.ratingScore / step) * step;
            datas.set(floored, (datas.get(floored) ?? 0) + 1);
        });

        const sorted = [...datas].toSorted(([a], [b]) => a - b);
        const min = sorted[0][0];
        const max = sorted[sorted.length - 1][0];
        const labels: number[] = [];
        for (let i = min; i <= max; i += step) {
            labels.push(i);
        }
        const data: number[] = [];
        labels.forEach((l) => {
            data.push(datas.get(l) ?? 0);
        });

        const flooredMine = myData?.ratingScore
            ? Math.floor(myData.ratingScore / step) * step
            : null;
        const backgroundColor = labels.map((l) => {
            if (l === flooredMine) {
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
        };
    }

    const lang = getLang();
    const i18n = $derived(getI18n($lang).statistic.song);
</script>

<div class="section">
    <h2>{i18n.songRatingDistribution}</h2>
    <div class="canvas-container">
        <canvas bind:this={canvas}></canvas>
    </div>
</div>

<style>
    .canvas-container {
        width: 100%;
        overflow-x: auto;
    }

    canvas {
        min-width: 100%;
    }
</style>
