import type { Genre } from "@taiko-wiki/taikowiki-api";
import type { Difficulty } from "hiroba-js";
import type { User } from "../user";

export namespace COLOR {
    export class RGB {
        r: number;
        g: number;
        b: number;
        a?: number;

        constructor(r: number, g: number, b: number, a?: number) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        toString() {
            return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a ?? 1})`
        }

        [Symbol.toPrimitive](hint: string){
            if(hint === "string"){
                return this.toString();
            }
        }
    }
    export namespace THEME {
        export const LIGHT = {
            HEADER: new RGB(207, 72, 68),
            MAIN: new RGB(207, 72, 68),
            BG: new RGB(255, 255, 255)
        };
        export const DARK = {
            HEADER: new RGB(51, 46, 46),
            MAIN: new RGB(15, 15, 15),
            BG: new RGB(40, 40, 40)
        };
    };
    export const RAINBOW = [new RGB(255, 103, 255), new RGB(255, 177, 32), new RGB(255, 252, 43), new RGB(255, 255, 223), new RGB(180, 255, 31), new RGB(49, 233, 250), new RGB(146, 153, 246)];
    export namespace DANI {
        export const FRAME = {
            'silver': ['silver'],
            'gold': ["rgba(222, 189, 0, 1)", "rgba(255, 228, 74, 1)", "rgba(255, 238, 143, 1)", "rgba(255, 228, 74, 1)", "rgba(222, 189, 0, 1)"],
            'rainbow': RAINBOW
        } as const;
        export const BG = {
            LIGHT: {
                kyu: new RGB(255, 240, 211),
                lowdan: new RGB(226, 235, 238),
                highdan: new RGB(238, 226, 226),
                jin: new RGB(229, 242, 245),
                tatsujin: new RGB(248, 237, 200),
                jiho: new RGB(255, 208, 150),
                chiuken: new RGB(186, 151, 121),
                fukusho: new RGB(82, 76, 74),
                gaiden: new RGB(157, 189, 173)
            },
            DARK: {
                kyu: new RGB(93, 90, 64),
                lowdan: new RGB(64, 86, 93),
                highdan: new RGB(95, 66, 66),
                jin: new RGB(128, 149, 156),
                tatsujin: new RGB(142, 140, 81),
                jiho: new RGB(255, 208, 150),
                chiuken: new RGB(186, 151, 121),
                fukusho: new RGB(82, 76, 74),
                gaiden: new RGB(99, 128, 114)
            }
        } as const;
        export const LIGHT = {
            kyu: new RGB(237, 193, 111),
            lowdan: new RGB(115, 197, 255),
            highdan: new RGB(230, 82, 82),
            jin: new RGB(145, 163, 168),
            tatsujin: new RGB(244, 188, 43),
            jiho: new RGB(246, 174, 84),
            chiuken: new RGB(188, 119, 63),
            fukusho: new RGB(43, 40, 39),
            gaiden: new RGB(85, 143, 114)
        } as const;
        export const DARK = {
            kyu: new RGB(216, 185, 127),
            lowdan: new RGB(79, 146, 207),
            highdan: new RGB(188, 83, 83),
            jin: new RGB(145, 163, 168),
            tatsujin: new RGB(244, 188, 43),
            jiho: new RGB(246, 174, 84),
            chiuken: new RGB(188, 119, 63),
            fukusho: new RGB(43, 40, 39),
            gaiden: new RGB(85, 143, 114)
        } as const;
    }
    export namespace RATING {
        export const TIER = {
            omega: [new RGB(255, 160, 254), new RGB(86, 251, 185), new RGB(99, 171, 248)],
            grandmaster: new RGB(161, 19, 19),
            master: new RGB(125, 0, 217),
            sapphire: new RGB(14, 118, 230),
            ruby: new RGB(255, 0, 93),
            gold: new RGB(230, 172, 0),
            silver: new RGB(122, 122, 122),
            bronze: new RGB(115, 67, 0),
            pearl: new RGB(224, 215, 173)
        } as const;

        export function TIER_BG(tierName: User.TierName) {
            if (tierName === "omega") {
                return `linear-gradient(to right, ${COLOR.RATING.TIER.omega.map((c, i, a) => `${c} ${(i / (a.length - 1)) * 100}%`).join(", ")})`;
            } else {
                return `linear-gradient(to right, ${COLOR.RATING.TIER[tierName]})`;
            }
        }

        export const dani = {
            backgroundColor: {
                light: {
                    kyu: new RGB(255, 240, 211),
                    lowdan: new RGB(226, 235, 238),
                    highdan: new RGB(238, 226, 226),
                    jin: new RGB(229, 242, 245),
                    tatsujin: new RGB(248, 237, 200),
                    jiho: new RGB(255, 208, 150),
                    chiuken: new RGB(186, 151, 121),
                    fukusho: new RGB(82, 76, 74),
                    gaiden: new RGB(157, 189, 173)
                } as const,
                dark: {
                    kyu: new RGB(93, 90, 64),
                    lowdan: new RGB(64, 86, 93),
                    highdan: new RGB(95, 66, 66),
                    jin: new RGB(128, 149, 156),
                    tatsujin: new RGB(142, 140, 81),
                    jiho: new RGB(255, 208, 150),
                    chiuken: new RGB(186, 151, 121),
                    fukusho: new RGB(82, 76, 74),
                    gaiden: new RGB(99, 128, 114)
                } as const
            } as const,
            color: {
                light: {
                    kyu: new RGB(237, 193, 111),
                    lowdan: new RGB(115, 197, 255),
                    highdan: new RGB(230, 82, 82),
                    jin: new RGB(145, 163, 168),
                    tatsujin: new RGB(244, 188, 43),
                    jiho: new RGB(246, 174, 84),
                    chiuken: new RGB(188, 119, 63),
                    fukusho: new RGB(43, 40, 39),
                    gaiden: new RGB(85, 143, 114)
                } as const,
                dark: {
                    kyu: new RGB(216, 185, 127),
                    lowdan: new RGB(79, 146, 207),
                    highdan: new RGB(188, 83, 83),
                    jin: new RGB(145, 163, 168),
                    tatsujin: new RGB(244, 188, 43),
                    jiho: new RGB(246, 174, 84),
                    chiuken: new RGB(188, 119, 63),
                    fukusho: new RGB(43, 40, 39),
                    gaiden: new RGB(85, 143, 114)
                } as const
            } as const
        } as const;
    };

    export const GENRE: Record<Genre, RGB> = {
        pops: new RGB(79, 181, 189),
        vocaloid: new RGB(167, 171, 199),//"#a5d1da",
        anime: new RGB(226, 141, 200),
        namco: new RGB(235, 107, 106),
        game: new RGB(182, 151, 211),
        variety: new RGB(64, 201, 119),
        classic: new RGB(204, 189, 74),
        kids: new RGB(235, 184, 80)
    } as const;

    export const DIFFICULTY: Record<Difficulty | "oniura", string | RGB> = {
        "easy": new RGB(255, 39, 3),
        "normal": new RGB(100, 126, 47),
        "hard": new RGB(54, 73, 56),
        "oni": new RGB(219, 24, 133),
        "ura": new RGB(113, 53, 219),
        "oniura": "linear-gradient(rgb(219, 24, 133) 0%, rgb(219, 24, 133) 50%, rgb(113, 53, 219) 50%, rgb(113, 53, 219) 100% )"
    } as const;

    export const DARK_DIFFICULTY: Record<Difficulty, RGB> = {
        "easy": new RGB(255, 39, 3),
        "normal": new RGB(100, 126, 47),
        "hard": new RGB(54, 73, 56),
        "oni": new RGB(214, 77, 154),
        "ura": new RGB(148, 106, 222)
    } as const;
}
export namespace CONST {
    export namespace SONG {
        export const GENRE = ["pops", "anime", "kids", "game", "variety", "namco", "vocaloid", "classic"] as const
        export const DIFFICULTY = ["easy", "normal", "hard", "oni", "ura"] as const
        export const VERSION = [
            ["NAC"],
            ["AC1", "AC2", "AC3", "AC4", "AC5", "AC6", "AC7", "AC8", "AC9", "AC10", "AC11", "AC12", "AC12.5", "AC13", "AC14"],
            ["DF"],
            ["NS2", "NS1", "NSRPG"],
            ["PS4"],
            ["TDM"],
            ["WiiU1", "WiiU2", "WiiU3"],
            ["Wii1", "Wii2", "Wii3", "Wii4", "Wii5"],
            ["PS2-1", "PS2-2", "PS2-3", "PS2-4", "PS2-5", "PS2-6", "PS2-7", "PS2Anime1", "PS2Anime2", "PS2TDM"],
            ["PSP1", "PSP2", "PSPDX"],
            ["DS1", "DS2", "DS3"],
            ["V", "IDM"],
            ["3DS1", "3DS2", "3DS3"],
            ["PLUS", "PTB", "RC"]
        ] as const
        export const DANIVERSION = ["katsudon", "sorairo", "momoiro", "kimidori", "murasaki", "white", "red", "yellow", "blue", "green", "nijiiro_gaiden", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"] as const;
        export const REGULAR_DAN = ["senpo", "jiho", "chiuken", "fukusho", "taisho", "beginner", "10kyu", "9kyu", "8kyu", "7kyu", "6kyu", "5kyu", "4kyu", "3kyu", "2kyu", "1kyu", "1dan", "2dan", "3dan", "4dan", "5dan", "6dan", "7dan", "8dan", "9dan", "10dan", "kuroto", "meijin", "chojin", "tatsujin"] as const;
        export const DAN = [...REGULAR_DAN, "gaiden"] as const;
    };
    export namespace DANI {
        export const NIJIIRO_REGULAR_DAN = ["5kyu", "4kyu", "3kyu", "2kyu", "1kyu", "1dan", "2dan", "3dan", "4dan", "5dan", "6dan", "7dan", "8dan", "9dan", "10dan", "kuroto", "meijin", "chojin", "tatsujin"] as const;
        export const DAN_JPN = {
            'tatsujin': '達人',
            'chojin': '超人',
            'meijin': '名人',
            'kuroto': '玄人',
            '10dan': '十段',
            '9dan': '九段',
            '8dan': '八段',
            '7dan': '七段',
            '6dan': '六段',
            '5dan': '五段',
            '4dan': '四段',
            '3dan': '三段',
            '2dan': '二段',
            '1dan': '初段',
            '1kyu': '一級',
            '2kyu': '二級',
            '3kyu': '三級',
            '4kyu': '四級',
            '5kyu': '五級'
        } as const;
    };
    export namespace RATING {
        export const TIER_NAME = ['pearl', 'bronze', 'silver', 'gold', 'ruby', 'sapphire', 'master', 'grandmaster', 'omega'] as const;
        export const TIER_INTERVAL = 2150;
        export const GRADE_INTERVAL = TIER_INTERVAL / 5;
        export const TIER_BORDER = {
            omega: TIER_INTERVAL * 6,
            grandmaster: TIER_INTERVAL * 5 + GRADE_INTERVAL * 4,
            master: TIER_INTERVAL * 5 + GRADE_INTERVAL * 3,
            sapphire: TIER_INTERVAL * 5,
            ruby: TIER_INTERVAL * 4,
            gold: TIER_INTERVAL * 3,
            silver: TIER_INTERVAL * 2,
            bronze: TIER_INTERVAL * 1,
            pearl: 0
        } as const;
    }
}

/* String.prototype.capitalize */
declare global {
    interface String {
        capitalize(): string;
    }
}
String.prototype.capitalize = function () {
    if (!this) return this;
    return this[0].toUpperCase() + this.slice(1);
}