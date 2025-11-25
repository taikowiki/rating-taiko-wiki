import { browser } from "$app/environment";
import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";
import type { User } from "../user";
import { LANG, LANG_CODE_MAP, type I18n } from "../i18n";

/**
 * 테마 초기화 후 store을 context에 저장
 */
export function initTheme(initValue?: 'light' | 'dark') {
    const theme = writable<'light' | 'dark'>(getInitValue());
    if (browser) {
        theme.subscribe((value) => {
            if (value === "light") {
                document.body.classList.remove('theme-dark');
                document.body.classList.add('theme-light');
            }
            else {
                document.body.classList.remove('theme-light');
                document.body.classList.add('theme-dark');
            }
            window.cookieStore.set('theme', value);
            window.localStorage.setItem('theme', value);
        })
    }
    setContext('theme', theme);

    function getInitValue() {
        if (initValue) return initValue;
        if (browser) {
            return (window.localStorage.getItem('theme') as 'light' | 'dark') ??
                (window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light')
        }
        else {
            return 'light';
        }
    }
}
/**
 * Context에서 테마 store 가져오기
 */
export function getTheme() {
    return getContext('theme') as Writable<'light' | 'dark'>;
}

/**
 * 모바일 여부 store 초기화
 */
export function initIsMobile(initValue?: boolean) {
    if (browser) {
        const isMobile = writable(window.innerWidth <= 767);
        window.addEventListener('resize', () => {
            isMobile.set(window.innerWidth <= 767);
        });
        isMobile.subscribe((value) => {
            window.localStorage.setItem('isMobile', value ? 'true' : 'false');
            window.cookieStore.set('isMobile', value ? 'true' : 'false');
        })
        setContext('isMobile', isMobile);
    }
    else {
        const isMobile = writable(initValue ?? false);
        setContext('isMobile', isMobile);
    }
}
/**
 * 모바일 여부 store 가져오기
 */
export function getIsMobile() {
    return getContext('isMobile') as Writable<boolean>;
}

/**
 * Time zone을 context에 저장
 */
export function setTimezone(tz: string) {
    setContext('timezone', tz);
}
/**
 * Context에서 time zone 가져오기
 */
export function getTimezone() {
    return getContext('timezone') as string;
}

/**
 * context에 profile store 저장
 */
export function setProfile(profile?: User.Profile | null) {
    const profileStore = writable(profile ?? null);
    setContext('profile', profileStore);
}
/**
 * context에서 profile store 가져오기
 */
export function getProfile() {
    return getContext('profile') as Writable<User.Profile | null>;
}

/**
 * 언어 store 초기화
 */
export function initLang(initValue?: I18n.Lang) {
    const lang = writable<I18n.Lang>(initValue ?? 'ko');
    if (browser) {
        const storagedLang = window.localStorage.getItem('lang');
        lang.set(LANG.includes(storagedLang as I18n.Lang) ? storagedLang as I18n.Lang : getLangFromLangCode());
        lang.subscribe((value) => {
            window.localStorage.setItem('lang', value);
            window.cookieStore.set('lang', value);
        });
    }
    setContext('lang', lang);

    function getLangFromLangCode() {
        if (!("navigator" in window)) return 'ko';
        const langCode = window.navigator.language;
        if (langCode in LANG_CODE_MAP) {
            return LANG_CODE_MAP[langCode as keyof typeof LANG_CODE_MAP];
        }
        return 'ko';
    }
}
/**
 * context에서 언어 store 가져오기
 */
export function getLang() {
    return getContext('lang') as Writable<I18n.Lang>;
}