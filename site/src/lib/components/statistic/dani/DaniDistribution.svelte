<script lang="ts">
    import { getI18n } from "$lib/module/i18n";
    import { getLang, getTheme } from "$lib/module/layout";
    import type { User } from "$lib/module/user";
    import { CONST } from "$lib/module/util";
    import { Chart } from "chart.js/auto";
    import { onDestroy, onMount } from "svelte";

    interface Props {
        myTaikoProfile?: User.TaikoProfile;
        statisticData: Record<
            User.Dani["dan"],
            {
                currentRatingScore: number;
                dan: User.Dani["dan"];
                danType: "red" | "gold";
            }[]
        >;
    }

    let { myTaikoProfile, statisticData }: Props = $props();
    let datasets = $derived.by(() => {
        type R = Record<
            (typeof CONST.DANI.NIJIIRO_REGULAR_DAN)[number],
            number | null
        >;

        const rec: Partial<R> = {};
        for (const dan of CONST.DANI.NIJIIRO_REGULAR_DAN) {
            rec[dan] = null;
        }
        for (const [dan, datas] of Object.entries(statisticData)) {
            rec[dan as keyof R] = datas.length;
        }

        const backgroundColor = CONST.DANI.NIJIIRO_REGULAR_DAN.map((dan, i) => {
            if (dan === (myTaikoProfile?.dani?.dan ?? false)) {
                return "#f97316";
            }
            return "#0d9488";
        });

        return [
            {
                label: "Number of people",
                data: CONST.DANI.NIJIIRO_REGULAR_DAN.map(
                    (dan) => (rec as R)[dan],
                ),
                backgroundColor,
            },
        ];
    });

    let canvas = $state<HTMLCanvasElement>();
    let unsubscribers = $state<(() => void)[]>([]);
    let chart = $state<Chart>();
    onMount(() => {
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        let labels = CONST.DANI.NIJIIRO_REGULAR_DAN.map(
            (dan) => i18n.dani[dan],
        );
        const tickColor = $theme === "light" ? "gray" : "white";
        chart = new Chart(ctx, {
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
                maintainAspectRatio: false
            },
        });
        unsubscribers.push(
            theme.subscribe((value) => {
                if (!chart) return;
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
            }),
        );
        unsubscribers.push(
            lang.subscribe((value) => {
                if (!chart) return;
                const i18n = getI18n(value);
                chart.data.labels = CONST.DANI.NIJIIRO_REGULAR_DAN.map(
                    (dan) => i18n.dani[dan],
                );
                chart.update();
            }),
        );
    });
    onDestroy(() => {
        unsubscribers.forEach((unsubscriber) => unsubscriber());
    });

    const theme = getTheme();
    const lang = getLang();
    const i18n = $derived(getI18n($lang));
</script>

<div class="section">
    <h2>{i18n.statistic.dani.daniDistribution}</h2>
    <div class="canvas-container">
        <canvas bind:this={canvas}></canvas>
    </div>
</div>

<style>
    .canvas-container {
        width: 100%;
        overflow-x: auto;
    }

    canvas{
        min-width: 100%;
    }
</style>
