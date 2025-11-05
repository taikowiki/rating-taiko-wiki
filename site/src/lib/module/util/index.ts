export namespace COLOR {
    export namespace THEME {
        export const LIGHT = {
            HEADER: '#cf4844',
            MAIN: '#cf4844',
            BG: '#ffffff'
        };
        export const DARK = {
            HEADER: '#332e2e',
            MAIN: '#0f0f0f',
            BG: '#282828'
        };
    };
    export const RAINBOW = ['#ff67ff', '#ffb120', '#fffc2b', '#ffffdf', '#b4ff1f', '#31e9fa', '#9299f6'];
    export namespace DANI {
        export const FRAME = {
            'silver': ['silver'],
            'gold': ["rgba(222, 189, 0, 1)", "rgba(255, 228, 74, 1)", "rgba(255, 238, 143, 1)", "rgba(255, 228, 74, 1)", "rgba(222, 189, 0, 1)"],
            'rainbow': RAINBOW
        }
    }
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
    }

}