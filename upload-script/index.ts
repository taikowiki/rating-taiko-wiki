import { CardData, ClearData, DaniNo, Difficulty, DifficultyScoreData, DonderHiroba, RecentPlayed, ScoreData, Summary } from 'hiroba-js';
//@ts-expect-error
import style from './main.css' with {type: 'text'};
import TaikowikiApi, { REGULAR_DAN } from '@taiko-wiki/taikowiki-api';
import LZUTF8 from 'lzutf8';

class Uploader {
    view: UploaderView;
    scoreDataStore: ScoreDataStore;
    cardData: (CardData & { summary?: Summary }) | null = null;

    constructor() {
        this.view = new UploaderView();
        this.scoreDataStore = new ScoreDataStore();
    }

    async init() {
        this.cardData = await DonderHiroba.func.getCurrentLogin().catch(() => null);
        if (!this.cardData) {
            this.view.displayAlert("Not logined in to donderhiroba.", 'error');
            return;
        }
        this.view.displayCard(this.cardData);
        const cd = this.cardData;

        const wikiLogined = await this.checkWikiLogined();
        if (!wikiLogined) {
            this.view.displayAlert("Not logined in to taiko.wiki", 'error');
            return;
        }

        this.view.displayUploadBtn(() => this.upload(cd));
        this.view.displayCacheResetBtn(() => this.resetCache());
    }

    private async checkWikiLogined(): Promise<boolean> {
        try {
            const response = await fetch('https://taiko.wiki/api/user', { credentials: 'include' });
            const data = await response.json();
            return data.logined ?? false;
        }
        catch {
            return false;
        }
    }

    private async upload(cardData: (CardData & { summary?: Summary })) {
        this.view.hideUploadBtn();
        this.view.hideCacheResetBtn();

        try {
            this.view.displayAlert("Fetching...");
            const dani = await this.fetchDani();

            const taikoProfile: TaikoProfile = {
                nickname: cardData.nickname,
                taikoNo: cardData.taikoNumber,
                crown: cardData.summary?.crown ?? {
                    donderfull: 0,
                    gold: 0,
                    silver: 0
                },
                badge: cardData.summary?.badge ?? {
                    rainbow: 0,
                    purple: 0,
                    pink: 0,
                    gold: 0,
                    silver: 0,
                    bronze: 0,
                    white: 0
                },
                dani
            }

            const clearData = await DonderHiroba.func.getClearData();

            const scoreData = await this.fetchScoreData(clearData);

            const uploadData = {
                taikoProfile,
                clearData,
                scoreData
            };

            this.view.displayAlert("Uploading...");
            await fetch('https://rating.taiko.wiki/api/v1/rating/upload', {
                method: 'post',
                body: LZUTF8.compress(JSON.stringify(uploadData), { outputEncoding: 'Base64' }),
                credentials: 'include',
                headers: {
                    'content-type': 'application/json'
                }
            })
            this.view.displayAlert("Upload Complete!");
            this.scoreDataStore.update();
        }
        catch {
            this.view.displayAlert("Error occurred.", 'error');
        }

        this.view.displayUploadBtn(() => this.upload(cardData));
        this.view.displayCacheResetBtn(() => this.resetCache());
    }

    private async fetchDani() {
        const daniPass = await DonderHiroba.func.getDaniPass({});
        for (let i = 19; i >= 1; i--) {
            const pass = daniPass?.[i as DaniNo];
            if (!pass) continue;
            const dani = {
                dan: REGULAR_DAN[i + 10],
                type: pass.pass,
                frame: pass.frame === "donderfull" ? 'rainbow' : pass.frame
            };
            return dani as TaikoProfile['dani'];
        }
        return null;
    }

    private async fetchScoreData(clearData: ClearData[]) {
        const taikowiki = new TaikowikiApi();
        const songs = await taikowiki.songAll();

        // scoreData
        let firstRecentPlayed: RecentPlayed | undefined;
        const scoreData: { [songNo: string]: ScoreData } = this.scoreDataStore.getAll();
        for (let page = 1; ; page++) {
            const recentPlayedArr = await DonderHiroba.func.getRecentPlayed({ page });
            let stop = false;

            for (let i = 0; i < recentPlayedArr.length; i++) {
                const recentPlayed = recentPlayedArr[i];
                if(recentPlayed.diff !== "oni" && recentPlayed.diff !== "ura") continue;

                let song = songs.find((song) => {
                    const titleSame = song.title === recentPlayed.title;
                    if (titleSame) return titleSame;
                    const songNoFromClearData = clearData.find((c) => c.title === recentPlayed.title)?.songNo;
                    if (!songNoFromClearData) return false;
                    return song.songNo === songNoFromClearData;
                })
                if (!song) {
                    console.error(recentPlayed);
                    continue;
                };

                // 처음 데이터와 비교
                if (firstRecentPlayed
                    && firstRecentPlayed.title === recentPlayed.title
                    && firstRecentPlayed.diff === recentPlayed.diff
                ) {
                    stop = true;
                    break;
                }
                if (!firstRecentPlayed) {
                    firstRecentPlayed = recentPlayed;
                }

                // 저장된 데이터와 비교
                const storedData = this.scoreDataStore.get(song.songNo, recentPlayed.diff);
                if (storedData &&
                    storedData.score === recentPlayed.data.score &&
                    storedData.good === recentPlayed.data.good &&
                    storedData.ok === recentPlayed.data.ok &&
                    storedData.bad === recentPlayed.data.bad &&
                    storedData.maxCombo === recentPlayed.data.maxCombo &&
                    storedData.roll === recentPlayed.data.roll &&
                    storedData.crown === recentPlayed.data.crown &&
                    storedData.badge === recentPlayed.data.badge &&
                    storedData.count.play === recentPlayed.data.count.play &&
                    storedData.count.fullcombo === recentPlayed.data.count.fullcombo &&
                    storedData.count.clear === recentPlayed.data.count.clear &&
                    storedData.count.donderfullcombo === recentPlayed.data.count.donderfullcombo
                ) {
                    stop = true;
                    break;
                }

                if (!scoreData?.[song.songNo]) {
                    scoreData[song.songNo] = {
                        title: song.title,
                        songNo: song.songNo,
                        difficulty: {}
                    }
                };
                const diffScoreData = {
                    ...recentPlayed.data,
                    ranking: 0
                }
                this.scoreDataStore.set(song.songNo, recentPlayed.diff, diffScoreData, song.title);
                scoreData[song.songNo].difficulty[recentPlayed.diff] = diffScoreData;
            }
            if (stop) break;
        }
        return scoreData;
    }

    private resetCache() {
        this.scoreDataStore.reset();
        this.view.displayAlert("Cache reset.")
    }
}

class UploaderView {
    private container: HTMLDivElement;
    private cardDataContainer: HTMLDivElement;
    private alertContainer: HTMLDivElement;
    private uploadBtnContainer: HTMLDivElement;
    private cacheResetBtnContainer: HTMLDivElement;

    constructor() {
        document.body.innerHTML = '';
        document.body.style.backgroundColor = 'white';

        const styleElement = document.createElement('style');
        styleElement.innerHTML = style;
        document.head.appendChild(styleElement);

        this.container = document.createElement('div');
        this.container.classList.add('uploader-container');

        this.alertContainer = document.createElement('div');
        this.alertContainer.classList.add('alert');
        this.container.appendChild(this.alertContainer);

        this.cardDataContainer = document.createElement('div');
        this.cardDataContainer.classList.add('cardData-container');
        this.container.appendChild(this.cardDataContainer);

        this.uploadBtnContainer = document.createElement('div');
        this.container.appendChild(this.uploadBtnContainer);

        this.cacheResetBtnContainer = document.createElement('div');
        this.container.appendChild(this.cacheResetBtnContainer);

        document.body.appendChild(this.container);
    }

    displayCard(cardData: CardData) {
        this.cardDataContainer.innerHTML = '';

        const mydonElement = document.createElement('img');
        mydonElement.src = `https://img.taiko-p.jp/imgsrc.php?v=&kind=mydon&fn=mydon_${cardData.taikoNumber}`;
        mydonElement.classList.add('mydon');
        this.cardDataContainer.appendChild(mydonElement);

        const profileElement = document.createElement('div');
        profileElement.classList.add('profile-container');
        profileElement.innerHTML += `<div class="taikono">${cardData.taikoNumber}</div>`;
        profileElement.innerHTML += `<div class="nickname">${cardData.nickname}</div>`;
        this.cardDataContainer.appendChild(profileElement);
    }

    displayAlert(message: string, type?: 'notice' | 'error') {
        this.alertContainer.innerHTML = '';
        if (type === "error") {
            this.alertContainer.classList.add('error');
        }
        else {
            this.alertContainer.classList.remove('error');
        }
        this.alertContainer.innerText = message;
    }

    displayUploadBtn(clickHandler: (event: MouseEvent) => void) {
        this.uploadBtnContainer.innerHTML = '';

        const uploadBtn = document.createElement('button');
        uploadBtn.innerText = 'Upload';
        uploadBtn.addEventListener('click', clickHandler);
        this.uploadBtnContainer.appendChild(uploadBtn);
    }

    hideUploadBtn() {
        this.uploadBtnContainer.innerHTML = '';
    }

    displayCacheResetBtn(clickHandler: () => void) {
        this.cacheResetBtnContainer.innerHTML = '';

        const cacheResetBtn = document.createElement('button');
        cacheResetBtn.innerText = 'Cache reset';
        cacheResetBtn.addEventListener('click', clickHandler);
        this.cacheResetBtnContainer.appendChild(cacheResetBtn);
    }

    hideCacheResetBtn() {
        this.cacheResetBtnContainer.innerHTML = '';
    }
}

class ScoreDataStore {
    private data: { [songNo: string]: ScoreData };

    constructor() {
        const dataInLocalStorage = window.localStorage.getItem('scoreData');
        if (dataInLocalStorage) {
            this.data = JSON.parse(dataInLocalStorage);
        }
        else {
            this.data = {};
        }
    }

    get(songNo: string, diff: Difficulty): DifficultyScoreData | null {
        return this.data?.[songNo]?.difficulty?.[diff] ?? null;
    }
    set(songNo: string, diff: Difficulty, diffScoreData: DifficultyScoreData, title: string) {
        if (!this.data?.[songNo]) {
            this.data[songNo] = {
                title,
                songNo,
                difficulty: {}
            }
        }

        this.data[songNo].difficulty[diff] = diffScoreData;
    }
    update() {
        window.localStorage.setItem('scoreData', JSON.stringify(this.data));
    }
    reset() {
        this.data = {};
        this.update();
    }
    getAll() {
        return structuredClone(this.data);
    }
}

async function main() {
    const uploader = new Uploader();
    await uploader.init();
};
main();

type TaikoProfile = {
    taikoNo: string;
    nickname: string;
    crown: {
        donderfull: number;
        gold: number;
        silver: number;
    };
    badge: {
        rainbow: number;
        purple: number;
        pink: number;
        gold: number;
        silver: number;
        bronze: number;
        white: number;
    };
    dani: {
        dan: "5kyu" | "4kyu" | "3kyu" | "2kyu" | "1kyu" | "1dan" | "2dan" | "3dan" | "4dan" | "5dan" | "6dan" | "7dan" | "8dan" | "9dan" | "10dan" | "kuroto" | "meijin" | "chojin" | "tatsujin";
        type: "gold" | "red";
        frame: "gold" | "silver" | "rainbow";
    } | null;
}