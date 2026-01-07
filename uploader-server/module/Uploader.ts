import LZUTF8 from "lzutf8";
import { ClearData, ScoreData, TaikoProfile } from "./types";

export class Uploader {
    async upload({ UUID, taikoProfile, scoreData, clearData }: { UUID: string; taikoProfile: TaikoProfile; scoreData: ScoreData; clearData: ClearData[] }) {
        //process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        await fetch('https://rating.taiko.wiki/api/internal/upload-rating-data', {
            method: 'POST',
            headers: {
                'x-internal-key': process.env.INTERNAL_API_KEY,
                'content-type': 'application/json'
            },
            body: LZUTF8.compress(JSON.stringify({
                UUID,
                taikoProfile,
                clearData,
                scoreData
            }), { outputEncoding: 'Base64' })
        })
    }
}