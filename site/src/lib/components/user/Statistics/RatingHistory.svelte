<script lang="ts">
    import type { User } from "$lib/module/user";
    import { onMount } from "svelte";
    import { Chart } from "chart.js";
    import { getTheme, getTimezone } from "$lib/module/layout";
    import type { Unsubscriber } from "svelte/store";
    import { DateTime } from "luxon";

    // Coefficient of Determination
    interface Props {
        ratingScoreHistory: User.RatingData["ratingScoreHistory"];
    }

    let { ratingScoreHistory }: Props = $props();
    let canvas = $state<HTMLCanvasElement>();
    let unsubscriber = $state<Unsubscriber>();

    onMount(() => {
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;
        Chart.defaults.color = $theme === "light" ? "black" : "white";
        Chart.defaults.borderColor = "gray";
        let labels = [null, ...ratingScoreHistory.map(([date]) => DateTime.fromJSDate(date, {zone: getTimezone()}).toFormat('yyyy-MM-dd')), null];
        let data = [null, ...ratingScoreHistory.map(([_, score]) => score), null];
        const chart = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [
                    {
                        label: "Rating score",
                        data,
                        borderColor: "skyblue",
                    },
                ],
            },
            options: {
                responsive: false,
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
            }
            chart.update();
        });
    });

    const theme = getTheme();
</script>

<h2>히스토리</h2>
<div class="canvas-container">
    <canvas
        bind:this={canvas}
        style={`width: max(${ratingScoreHistory.length * 30}px, 100%); height: 400px;`}
    ></canvas>
</div>

<style>
    h2 {
        width: 100%;
    }

    .canvas-container {
        width: 100%;
        overflow-x: auto;
    }
</style>
