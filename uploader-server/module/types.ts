export type TaikoProfile = {
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
        frame: "silver" | "gold" | "rainbow";
    } | null;
}

export type CourseScoreData = {
    crown: "silver" | "gold" | "donderfull" | "played" | null;
    badge: "bronze" | "silver" | "gold" | "rainbow" | "purple" | "pink" | "white" | null;
    score: number;
    ranking: number | null;
    good: number;
    ok: number;
    bad: number;
    maxCombo: number;
    roll: number;
    count: {
        donderfullcombo: number;
        fullcombo: number;
        clear: number;
        play: number;
    };
}

export type SongScoreData = {
    songNo: string;
    title: string;
    difficulty: Partial<Record<'easy' | 'normal' | 'hard' | 'oni' | 'ura', CourseScoreData>>
}

export type ScoreData = Record<string, SongScoreData>;

export type CourseClearData = {
    crown: "silver" | "gold" | "donderfull" | "played" | null;
    badge: "bronze" | "silver" | "gold" | "rainbow" | "purple" | "pink" | "white" | null;
}

export type ClearData = {
    title: string;
    songNo: string;
    difficulty: Partial<Record<'easy' | 'normal' | 'hard' | 'oni' | 'ura', CourseClearData>>
}