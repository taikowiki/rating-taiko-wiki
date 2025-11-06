<script lang="ts">
    import omega from "$lib/assets/icon/tier/omega.avif";
    import gm from "$lib/assets/icon/tier/grandmaster.avif";
    import master from "$lib/assets/icon/tier/master.avif";
    import sapphire from "$lib/assets/icon/tier/sapphire.svg";
    import ruby from "$lib/assets/icon/tier/ruby.svg";
    import plate from "$lib/assets/icon/tier/plate.avif";
    import type { User } from "$lib/module/user";
    import CssFilterConveter from "css-filter-converter";
    import { COLOR } from "$lib/module/util";
    import { browser } from "process";

    interface Props {
        tierName: User.TierName;
        tierGrade: number | null;
        size: number;
    }

    let { tierName, tierGrade, size }: Props = $props();
    let underRuby = $derived(['pearl', 'bronze', 'silver', 'gold'].some((tn) => tierName === tn) ? true : false);

    async function getImgSrc() {
        if (tierName === "omega") {
            return omega;
        } else if (tierName === "grandmaster") {
            return gm;
        } else if (tierName === "master") {
            return master;
        } else if (tierName === "sapphire") {;
            return sapphire;
        } else if (tierName === "ruby") {
            return ruby;
        } else if (browser) {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            [canvas.width, canvas.height] = [1000, 1000];

            const img = new Image();
            img.src = plate;
            await new Promise((res, rej) => {
                img.onload = res;
                img.onerror = rej;
            });

            const filter = CssFilterConveter.hexToFilter(
                COLOR.RATING.TIER[tierName],
            ).color;
            if (filter) {
                ctx.filter = filter;
            }
            ctx.drawImage(img, 0, 0, 1000, 1000);

            const url = canvas.toDataURL();
            canvas.remove();
            return url;
        }
    }
</script>

<div class="container" style={`width:${size}px;height:${size}px;`}>
    {#await getImgSrc() then src}
        {#if src}
            <img {src} alt={tierName} />
        {/if}
    {/await}
    <div class="grade" class:underRuby style={`font-size:${size / 2}px;`}>
        {#if tierGrade}
            {tierGrade}
        {:else if tierName === "pearl"}
            P
        {/if}
    </div>
</div>

<style>
    .container {
        position: relative;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    img{
        width: 100%;
    }
    .grade {
        position: absolute;
        font-weight: bold;
        color: white;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
        &.underRuby{
            top: 48%;
        }
    }
</style>
