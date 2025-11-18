<script lang="ts">
    import omega from "$lib/assets/icon/tier/omega.avif";
    import grandmaster from "$lib/assets/icon/tier/grandmaster.avif";
    import master from "$lib/assets/icon/tier/master.avif";
    import sapphire from "$lib/assets/icon/tier/sapphire.avif";
    import ruby from "$lib/assets/icon/tier/ruby.avif";
    import gold from "$lib/assets/icon/tier/gold.png";
    import silver from "$lib/assets/icon/tier/silver.png";
    import bronze from "$lib/assets/icon/tier/bronze.png";
    import pearl from "$lib/assets/icon/tier/pearl.png";
    import type { User } from "$lib/module/user";
    import CssFilterConveter from "css-filter-converter";
    import { COLOR } from "$lib/module/util";
    import { browser } from "process";

    const img = {
        omega,
        grandmaster,
        master,
        sapphire,
        ruby,
        gold,
        silver,
        bronze,
        pearl,
    } as const;

    interface Props {
        tierName: User.TierName;
        tierGrade: number | null;
        size: number;
    }

    let { tierName, tierGrade, size }: Props = $props();
    let underRuby = $derived(
        ["pearl", "bronze", "silver", "gold"].some((tn) => tierName === tn)
            ? true
            : false,
    );
</script>

<div class="container" style={`width:${size}px;height:${size}px;`}>
    <img src={img[tierName]} alt={tierName} />
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
        display: flex;
        justify-content: center;
        align-items: center;
    }
    img {
        width: 100%;
    }
    .grade {
        position: absolute;
        font-weight: bold;
        color: white;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
        &.underRuby {
            top: 48%;
        }
    }
</style>
