<script lang="ts">
    import { getI18n } from "$lib/module/i18n";
    import { getLang } from "$lib/module/layout";
    import type { Measure } from "$lib/module/measure";
    import { Gana, COLOR } from "$lib/module/util";
    import type { SongData } from "@taiko-wiki/taikowiki-api";

    interface Props {
        measures: Measure.Measure[];
        songTitleMap: Record<
            string,
            Pick<
                SongData,
                | "songNo"
                | "title"
                | "titleEn"
                | "titleKo"
                | "aliasEn"
                | "aliasKo"
                | "romaji"
            >
        >;
        forStatistic?: boolean;
    }

    let { measures, songTitleMap, forStatistic = false }: Props = $props();

    let searchQuery = $state("");
    const searched = $derived(filterMeasures(generateSearchReg(searchQuery)));

    function generateSearchReg(query: string) {
        const HALF_DAKUON = /[ｶ-ﾄﾊ-ﾎ][ﾞﾟ]/g;
        const SINGLE = /[ぁ-ゖｦ-ﾟ]/g;
        return new RegExp(
            ["", ...query.trim().split(" "), ""]
                .map((phrase) =>
                    RegExp.escape(
                        phrase
                            .replace(HALF_DAKUON, (m) => Gana.map[m] ?? m)
                            .replace(SINGLE, (m) => Gana.map[m] ?? m)
                            .toLowerCase(),
                    ),
                )
                .join("(.*)"),
        );
    }
    function filterMeasures(regexp: RegExp) {
        const filtered: {
            title: string;
            level: number;
            diff: "oni" | "ura";
            measureValue: number;
            songNo: string;
        }[] = [];
        measures.forEach((measure) => {
            const titleData = songTitleMap[measure.songno];
            if (!titleData) return;
            const passed =
                regexp.test(titleData.title.toLowerCase()) ||
                (titleData.titleEn &&
                    regexp.test(titleData.titleEn.toLowerCase())) ||
                (titleData.titleKo &&
                    regexp.test(titleData.titleKo.toLowerCase())) ||
                (titleData.aliasEn &&
                    regexp.test(titleData.aliasEn.toLowerCase())) ||
                (titleData.aliasKo &&
                    regexp.test(titleData.aliasKo.toLowerCase())) ||
                (titleData.romaji &&
                    regexp.test(titleData.romaji.toLowerCase()));
            if (!passed) return;
            filtered.push({
                title: titleData.title,
                level: measure.level,
                diff: measure.diff,
                measureValue: measure.measureValue,
                songNo: measure.songno,
            });
        });
        return filtered;
    }

    const lang = getLang();
    const i18n = $derived(getI18n($lang).measure);
</script>

<div class="measure-table-container">
    <input
        type="text"
        class="standard"
        bind:value={searchQuery}
        placeholder={i18n.search_placeholder}
    />
    <table>
        <thead>
            <tr>
                <th>{i18n.measure}</th>
                <th>{i18n.level}</th>
                <th class="th-title">{i18n.song_title}</th>
            </tr>
        </thead>
        <tbody>
            {#each searched as data}
                <tr>
                    <td>
                        <span
                            class="badge"
                            style="background-color: {COLOR.RATING.MEASURE(
                                data.measureValue,
                            )}"
                        >
                            {data.measureValue}
                        </span>
                    </td>
                    <td>
                        <span
                            class="badge"
                            style:background-color={COLOR.DIFFICULTY[
                                data.diff
                            ].toString()}
                        >
                            ★{data.level}
                        </span>
                    </td>
                    <td>
                        <a
                            class="title"
                            href={forStatistic
                                ? `/statistic/song/${data.songNo}?diff=${data.diff}`
                                : `//taiko.wiki/song/${data.songNo}?diff=${data.diff}`}
                            target={forStatistic ? "" : "_blank"}
                        >
                            {data.title}
                        </a>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style lang="scss">
    .measure-table-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    table {
        width: 100%;
        border-collapse: collapse;

        th,
        td {
            padding: 12px 15px;
            border-bottom: 1px solid;
        }

        th {
            text-align: center;
            font-weight: bold;
            &:not(.th-title) {
                width: fit-content;
                white-space: nowrap;
            }
            &.th-title {
                width: 100%;
            }
        }

        td:nth-child(1),
        td:nth-child(2) {
            text-align: center;
        }
    }
    :global(body.theme-light) {
        table,
        th,
        td {
            border-color: #e0e0e0;
        }
    }
    :global(body.theme-dark) {
        table,
        th,
        td {
            border-color: #424242;
        }
    }
    .badge {
        width: 47px;
        display: inline-block;
        padding: 4px 8px 4.5px 8px;
        border-radius: 4px;
        color: white;
        font-weight: bold;
        font-size: 0.9em;
        line-height: 1;
        box-sizing: border-box;
    }
    .title {
        color: inherit;
        font-weight: bold;
        &:hover {
            text-decoration: underline;
        }
    }
</style>
