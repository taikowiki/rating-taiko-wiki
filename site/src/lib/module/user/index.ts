export namespace User {
    export interface Data {
        order: number;
        provider: string;
        providerId: string;
        UUID: string;
        nickname: string;
        registerTime: number;
        grade: number;
        providerUserData: Object | null;
        lang: string;
        showRatingNickname: 0 | 1;
        showRatingTaikoNo: 0 | 1;
        showRatingSongs: 0 | 1;
    }
}