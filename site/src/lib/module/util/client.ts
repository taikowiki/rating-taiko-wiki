import { COLOR, CONST } from ".";
import type { User } from "../user";

/**
 * 알림용 Dialog 띄우기
 */
export function alertDialog(stringLike: any) {
    const dialog = document.createElement('dialog');
    dialog.classList.add('standard');
    dialog.innerText = `${stringLike}`;

    const closeBtn = document.createElement('button');
    closeBtn.innerText = '닫기';
    closeBtn.addEventListener('click', () => {
        dialog?.close();
        dialog?.remove();
    });
    dialog.appendChild(closeBtn);

    document.body.appendChild(dialog);
    dialog.showModal();
}

/**
 * TaikoProfileNameplate에 단위 이미지 생성
 */
export async function createDaniImage({ canvasElement, context, dani }: { canvasElement: HTMLCanvasElement, context: CanvasRenderingContext2D, dani: User.Dani }) {
    const DelaGothicOne = await new FontFace('Dela Gothic One', 'url(/font/Dela-Gothic-One.ttf)').load();
    document.fonts.add(DelaGothicOne);

    const width = 500;
    const height = 500;
    canvasElement.width = width;
    canvasElement.height = height;

    // frame
    const frameOuterRadius = 200;
    const frameInnerRadius = 110;
    context.beginPath();
    context.arc(width / 2, height / 2, frameOuterRadius, 0, Math.PI * 2);
    context.moveTo(width / 2 + frameInnerRadius, height / 2);
    context.arc(
        width / 2,
        height / 2,
        frameInnerRadius,
        0,
        Math.PI * 2,
        true,
    );
    // fill
    const frameGradient = context.createLinearGradient(
        width / 2,
        height / 2 - frameOuterRadius,
        width / 2,
        height / 2 + frameOuterRadius,
    );
    frameGradient.addColorStop(0, COLOR.DANI.FRAME[dani.frame][0].toString());
    for (let i = 1; i < COLOR.DANI.FRAME[dani.frame].length - 1; i++) {
        frameGradient.addColorStop(
            i / (COLOR.DANI.FRAME[dani.frame].length - 2),
            COLOR.DANI.FRAME[dani.frame][i].toString(),
        );
    }
    frameGradient.addColorStop(
        1,
        COLOR.DANI.FRAME[dani.frame].at(-1)?.toString() ?? "",
    );
    context.fillStyle = frameGradient;
    context.fill();
    // stroke
    context.strokeStyle = "black";
    context.lineWidth = 12;
    context.stroke();
    context.closePath();

    // text
    const textGradient = context.createLinearGradient(
        width / 2,
        (height / 2 - frameOuterRadius) / 1.2,
        width / 2,
        (height / 2 + frameOuterRadius) / 1.2,
    );
    textGradient.addColorStop(0, COLOR.DANI.FRAME[dani.frame][0].toString());
    for (let i = 1; i < COLOR.DANI.FRAME[dani.frame].length - 1; i++) {
        textGradient.addColorStop(
            i / (COLOR.DANI.FRAME[dani.frame].length - 2),
            COLOR.DANI.FRAME[dani.frame][i].toString(),
        );
    }
    textGradient.addColorStop(
        1,
        COLOR.DANI.FRAME[dani.frame].at(-1)?.toString() ?? "",
    );
    context.font = "230px 'Dela Gothic One'";
    context.fillStyle = dani.type === "red" ? "red" : "#ffb411";
    context.scale(1, 1.2);
    context.lineWidth = 40;
    context.strokeStyle = textGradient;
    context.strokeText(
        CONST.DANI.DAN_JPN[dani.dan][0],
        width * 0.035,
        height * 0.47,
    );
    context.strokeText(
        CONST.DANI.DAN_JPN[dani.dan][1],
        width * 0.51,
        height * 0.7,
    );
    context.fillText(
        CONST.DANI.DAN_JPN[dani.dan][0],
        width * 0.035,
        height * 0.47,
    );
    context.fillText(
        CONST.DANI.DAN_JPN[dani.dan][1],
        width * 0.51,
        height * 0.7,
    );
    context.lineWidth = 12;
    context.strokeStyle = "black";
    context.strokeText(
        CONST.DANI.DAN_JPN[dani.dan][0],
        width * 0.035,
        height * 0.47,
    );
    context.strokeText(
        CONST.DANI.DAN_JPN[dani.dan][1],
        width * 0.51,
        height * 0.7,
    );

    return canvasElement.toDataURL();
}