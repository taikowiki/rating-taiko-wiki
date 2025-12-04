import { Measure } from ".";
import { defineDBHandler } from "@yowza/db-handler";
import { queryBuilder } from "../db/server";

export namespace measureDBController {
    export const getAll = defineDBHandler<[], Measure.Measure[]>(() => {
        const query = queryBuilder.select('measure', '*');
        return async (run) => {
            return (await query.execute(run)).map((v) => ({ ...v, measureValue: normalizeMeasureValue(v.measureValue) })) as Measure.Measure[];
        }
    });
    export const getBySongNoAndDiff = defineDBHandler<[songNo: string, diff: 'oni' | 'ura'], Measure.Measure | null>((songNo, diff) => {
        const query = queryBuilder.select('measure', '*')
            .where(({ compare, column, value }) => [
                compare(column('measure.songno'), '=', value(songNo)),
                compare(column('measure.diff'), '=', value(diff))
            ]);

        return async (run) => {
            return (await query.execute(run)).map((v) => ({ ...v, measureValue: normalizeMeasureValue(v.measureValue) }))[0] as Measure.Measure ?? null;
        }
    });
    export const update = defineDBHandler<[measures: Measure.Measure[]]>((measures) => {
        const querys = measures.map((measure) =>
            queryBuilder.insert('measure')
                .set(({ value }) => ({
                    songno: value(measure.songno),
                    diff: value(measure.diff),
                    range: value(measure.range),
                    measureValue: value(measure.measureValue),
                    level: value(measure.level),
                    title: value(measure.title),
                    notes: value(measure.notes),
                    maxroll: value(measure.maxroll),
                }))
                .onDuplicate('update', ({ raw }) => ({
                    songno: raw('VALUES(`songno`)'),
                    diff: raw('VALUES(`diff`)'),
                    range: raw('VALUES(`range`)'),
                    measureValue: raw('VALUES(`measureValue`)'),
                    level: raw('VALUES(`level`)'),
                    title: raw('VALUES(`title`)'),
                    notes: raw('VALUES(`notes`)'),
                    maxroll: raw('VALUES(`maxroll`)'),
                }))
        );
        return async (run) => {
            for (const query of querys) {
                await query.execute(run);
            }
        }
    })

    function normalizeMeasureValue(value: number) {
        return Math.round(value * 10) / 10;
    }
}