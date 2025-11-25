import { i18n, preventUndefined } from "./langFile";

export const LANG = ['ko', 'ja', 'en'] as const;
export const LANG_CODE_MAP = {
    'ko-KR': 'ko',
    'ja-JP': 'ja',
    'en-US': 'en'
} as const;
export const LANG_NAME = {
    'ko': '한국어',
    'ja': '日本語',
    'en': 'English'
} as const;

export function getI18n(lang: I18n.Lang) {
    return i18n[lang]
}
export { preventUndefined };

export namespace I18n {
    export type Lang = typeof LANG[number];
}