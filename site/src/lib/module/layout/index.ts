import { browser } from "$app/environment";
import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";

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
        const isMobile = writable(initValue ?? window.innerWidth <= 767);
        window.addEventListener('resize', () => {
            isMobile.set(window.innerWidth <= 767);
        }); setContext('isMobile', isMobile);
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
export function setTimezone(tz: string){
    setContext('timezone', tz);
}
/**
 * Context에서 time zone 가져오기
 */
export function getTimezone(){
    return getContext('timezone') as string;
}