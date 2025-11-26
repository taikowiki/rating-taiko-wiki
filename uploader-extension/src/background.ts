import browser from 'webextension-polyfill';

browser.action?.onClicked.addListener(async () => {
    // 확장 프로그램 내부 HTML 경로
    const url = browser.runtime.getURL("index.html");
    await browser.tabs.create({ url });
});

console.log(browser.action)