import { DonderHiroba } from "hiroba-js";

export namespace TokenManager {
    let token: string | null = null;

    export async function getToken() {
        if (!token) {
            token = await DonderHiroba.func.getSessionToken({
                email: process.env.HIROBA_EMAIL,
                password: process.env.HIROBA_PASSWORD
            });
            const cardList = await DonderHiroba.func.getCardList({ token });
            await DonderHiroba.func.cardLogin({
                token,
                taikoNumber: cardList[0].taikoNumber
            });
        }
        return token;
    }

    export async function renewToken() {
        token = null;
        return await getToken();
    }
}