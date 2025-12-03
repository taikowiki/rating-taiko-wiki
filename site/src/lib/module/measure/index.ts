import z from "zod";

export namespace Measure {
    export namespace Schema {
        export const Measure = z.object({
            songno: z.string(),
            diff: z.literal(['oni', 'ura']),
            range: z.number(),
            measureValue: z.number(),
            level: z.number(),
            title: z.string(),
            notes: z.number(),
            maxroll: z.number()
        })
    }

    export type Measure = z.infer<typeof Schema.Measure>;
}