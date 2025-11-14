<script lang="ts">
    import UserCapture from "$lib/components/user/Capture/UserCapture.svelte";
    import Profile from "$lib/components/user/Profile/Profile.svelte";
    import RatingSong from "$lib/components/user/RatingSong/RatingSong.svelte";
    import Statistics from "$lib/components/user/Statistics/Statistics.svelte";
    import { getIsMobile, getTheme } from "$lib/module/layout/index.js";
    import { getNextTier, getTier } from "$lib/module/user/index.js";
    import { alertDialog } from "$lib/module/util/client.js";
    import { COLOR } from "$lib/module/util/index.js";
    import { setContext } from "svelte";
    import { writable } from "svelte/store";

    let { data } = $props();
    let top50 = $derived(data.ratingData.songRatingDatas.slice(0, 50));
    let ratingScoreHistory = $derived(data.ratingData.ratingScoreHistory);
    let currentTier = $derived(getTier(data.ratingData.currentRatingScore));
    let nextTier = $derived(
        getNextTier(currentTier.tierName, currentTier.tierGrade),
    );

    let captureContainer = writable<HTMLDivElement>();
    setContext("captureContainer", captureContainer);
    async function downloadImg() {
        if (!$captureContainer) return;

        alertDialog("이미지가 곧 다운로드됩니다.");

        const { default: html2canvas } = await import("html2canvas");
        const htmlCanvas = await html2canvas($captureContainer, {
            backgroundColor: $theme === "light" ? "white" : "#282828",
        });
        const canvas = document.createElement("canvas");
        canvas.width = htmlCanvas.width;
        canvas.height = htmlCanvas.height;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        if (!context) return;
        context.drawImage(htmlCanvas, 0, 0);

        const containerWidth = $captureContainer.offsetWidth;
        const canvasWidth = canvas.width;
        const ratio = canvasWidth / containerWidth;

        // draw tier text
        drawText();
        drawRatingScore();
        drawProgressLeftText();

        const imageDataURL = canvas.toDataURL('image/png');
        const anchor = document.createElement('a');
        anchor.href = imageDataURL;
        anchor.download = `Rating-${data.profile.nickname}.png`;
        anchor.click();
        canvas.remove();
        anchor.remove();

        function drawText() {
            const tierLeft =
                ($captureContainer.querySelector(".tier") as HTMLDivElement)
                    .offsetLeft * ratio;
            const tierTop =
                ($captureContainer.querySelector(".tier") as HTMLDivElement)
                    .offsetTop * ratio;
            const tierText =
                currentTier.tierName.capitalize() +
                (currentTier.tierGrade ? ` ${currentTier.tierGrade}` : "");

            //
            context.font = `bold ${25 * ratio}px 'Noto Sans JP'`;
            context.textBaseline = "top";
            const color = COLOR.RATING.TIER[currentTier.tierName];
            if (Array.isArray(color)) {
                const measure = context.measureText(tierText);
                const gradient = context.createLinearGradient(
                    tierLeft,
                    tierTop,
                    tierLeft + measure.width,
                    tierTop,
                );
                color.forEach((c, i) => {
                    gradient.addColorStop((i + 1) / 3, c.toString());
                });
                context.fillStyle = gradient;
            } else {
                context.fillStyle = color.toString();
            }
            context.fillText(tierText, tierLeft, tierTop + ratio * 4);
        }

        function drawRatingScore() {
            const left =
                ($captureContainer.querySelector(".rating") as HTMLDivElement)
                    .offsetLeft * ratio;
            const top =
                ($captureContainer.querySelector(".rating") as HTMLDivElement)
                    .offsetTop * ratio;
            const text = data.ratingData.currentRatingScore.toString();

            context.font = `bold ${25 * ratio}px 'Noto Sans JP'`;
            context.textBaseline = "top";
            const color = COLOR.RATING.TIER[currentTier.tierName];
            if (Array.isArray(color)) {
                const measure = context.measureText(text);
                const gradient = context.createLinearGradient(
                    left,
                    top,
                    left + measure.width,
                    top,
                );
                color.forEach((c, i) => {
                    gradient.addColorStop((i + 1) / 3, c.toString());
                });
                context.fillStyle = gradient;
            } else {
                context.fillStyle = color.toString();
            }
            context.fillText(text, left, top + ratio * 4);
        }

        function drawProgressLeftText() {
            $captureContainer
                .querySelectorAll(".progress-container .left")
                .forEach((element: Element) => {
                    const left = (element as HTMLElement).offsetLeft * ratio;
                    const top = (element as HTMLElement).offsetTop * ratio;
                    const text = (element as HTMLElement).innerText;

                    context.font = `bold ${16 * ratio}px 'Noto Sans JP'`;
                    context.textBaseline = "top";
                    const color = COLOR.RATING.TIER[currentTier.tierName];
                    if (Array.isArray(color)) {
                        const measure = context.measureText(text);
                        const gradient = context.createLinearGradient(
                            left,
                            top,
                            left + measure.width,
                            top,
                        );
                        color.forEach((c, i) => {
                            gradient.addColorStop((i + 1) / 3, c.toString());
                        });
                        context.fillStyle = gradient;
                    } else {
                        context.fillStyle = color.toString();
                    }
                    context.fillText(text, left, top + ratio * 4);
                });
            $captureContainer
                .querySelectorAll(".progress-container .right")
                .forEach((element: Element, i) => {
                    const left = (element as HTMLElement).offsetLeft * ratio;
                    const top = (element as HTMLElement).offsetTop * ratio;
                    const text = (element as HTMLElement).innerText;

                    context.font = `bold ${16 * ratio}px 'Noto Sans JP'`;
                    context.textBaseline = "top";
                    const color = COLOR.RATING.TIER[i === 0 ? nextTier.nextTierName : nextTier.nextGrade.tierName];
                    if (Array.isArray(color)) {
                        const measure = context.measureText(text);
                        const gradient = context.createLinearGradient(
                            left,
                            top,
                            left + measure.width,
                            top,
                        );
                        color.forEach((c, i) => {
                            gradient.addColorStop((i + 1) / 3, c.toString());
                        });
                        context.fillStyle = gradient;
                    } else {
                        context.fillStyle = color.toString();
                    }
                    context.fillText(text, left, top + ratio * 4);
                });
        }
    }

    const isMobile = getIsMobile();
    const theme = getTheme();
</script>

<div class="container">
    <Profile
        profile={data.profile}
        taikoProfile={data.taikoProfile}
        lastUpdate={data.ratingData.lastUpload}
        currentRatingScore={data.ratingData.currentRatingScore}
        currentExp={data.ratingData.currentExp}
        ranking={data.ratingData.ranking}
        {currentTier}
        {nextTier}
    />
    <!--
    <RatingScore
        currentRatingScore={data.ratingData.currentRatingScore}
        currentExp={data.ratingData.currentExp}
        ranking={data.ratingData.ranking}
    />
    -->
    <RatingSong
        songRatingDatas={data.ratingData.songRatingDatas}
        scoreData={data.ratingData.scoreData}
        {downloadImg}
    />
    <Statistics {top50} {ratingScoreHistory} />
</div>
<UserCapture
    {top50}
    scoreData={data.ratingData.scoreData}
    profile={data.profile}
    taikoProfile={data.taikoProfile}
    currentRatingScore={data.ratingData.currentRatingScore}
    currentExp={data.ratingData.currentExp}
    ranking={data.ratingData.ranking}
    {currentTier}
    {nextTier}
/>

<style>
    .container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-inline: max(calc((100% - 1000px) / 2), 0px);
        box-sizing: border-box;
        row-gap: 10px;
    }
</style>
