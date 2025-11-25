import { type I18n, preventUndefined } from "../i18n";
import { baseify } from "../util";

export const docTitle = ['introduction', 'upload'] as const;
const docContentRaw = {
    ko: baseify(import.meta.glob<any>('../../../../../docs/ko/**/*.md', { eager: true, query: '?raw' })),
    ja: baseify(import.meta.glob<any>('../../../../../docs/ja/**/*.md', { eager: true, query: '?raw' })),
    en: baseify(import.meta.glob<any>('../../../../../docs/en/**/*.md', { eager: true, query: '?raw' })),
};

export const docContent: Partial<Record<I18n.Lang, Record<string, string>>> = preventUndefined({
    ko: docContentFromRaw(docContentRaw.ko),
    ja: docContentFromRaw(docContentRaw.ja),
    en: docContentFromRaw(docContentRaw.en)
});

export const docImgs = baseify(import.meta.glob<any>('../../../../../docs/img/*', { eager: true }));

function docContentFromRaw(ob: Record<string, { default: string }>): Record<string, string> {
    const rawContentArray = Object.entries(ob)
        .sort(([keyA], [keyB]) => parseInt(keyA) - parseInt(keyB))
        .map(([_, val]) => val.default);

    const docContent: Record<string, string> = {};
    for (let i = 0; i < docTitle.length; i++) {
        const raw = rawContentArray[i];
        if (!raw) break;
        docContent[docTitle[i]] = raw;
    }
    return docContent;
}