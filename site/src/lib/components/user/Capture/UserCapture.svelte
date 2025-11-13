<script lang="ts">
    import { getTheme } from "$lib/module/layout";
    import type { getNextTier, getTier, User } from "$lib/module/user";
    import { getContext, onMount } from "svelte";
    import TaikoProfileBadge from "../Profile/TaikoProfileBadge.svelte";
    import TaikoProfileCrown from "../Profile/TaikoProfileCrown.svelte";
    import TaikoProfileNameplate from "../Profile/TaikoProfileNameplate.svelte";
    import RatingScore from "../RatingScore/RatingScore.svelte";
    import RatingSongGrid from "../RatingSong/RatingSongGrid.svelte";
    import type { Writable } from "svelte/store";

    interface Props {
        top50: User.SongRatingData[];
        scoreData: User.ScoreData;
        profile: User.Profile;
        taikoProfile: User.TaikoProfile;
        currentRatingScore: number;
        currentExp: number;
        ranking: number;
        currentTier: ReturnType<typeof getTier>;
        nextTier: ReturnType<typeof getNextTier>;
    }

    let {
        top50,
        scoreData,
        profile,
        taikoProfile,
        currentRatingScore,
        currentExp,
        ranking,
        currentTier,
        nextTier
    }: Props = $props();

    let captureContainer = $state<HTMLDivElement>();
    onMount(() => {
        if(!captureContainer) return;
        (getContext('captureContainer') as Writable<HTMLDivElement>)?.set(captureContainer);
    })

    const theme = getTheme();
</script>

<div class={`capture-container theme-${$theme}`} bind:this={captureContainer}>
    <div class="all-profile-container">
        <div class="profile-container">
            <div class={`nickname theme-${$theme}`}>
                {profile.nickname}
            </div>
            <img
                class="mydon"
                src={`/api/private/mydon?taikoNo=${taikoProfile.taikoNo}`}
                alt="mydon"
            />
        </div>
        <div class="taikoProfile-container">
            <TaikoProfileNameplate {...taikoProfile} />
            <TaikoProfileCrown crown={taikoProfile.crown} />
            <TaikoProfileBadge badge={taikoProfile.badge} />
        </div>
        <div class="ratingScore-container">
            <RatingScore {currentExp} {currentRatingScore} {ranking} {currentTier} {nextTier} />
        </div>
    </div>
    <RatingSongGrid songRatingDatas={top50} {scoreData} />
</div>

<style lang="scss">
    .capture-container {
        width: 1010px;
        position: absolute;
        top: 0;
        left: 0;
        transform: translate(-100%, 100%);
        box-sizing: border-box;
        padding: 5px;
    }

    .all-profile-container {
        display: flex;
        column-gap: 10px;
    }

    .profile-container {
        width: 250px;
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 10px;

        & .nickname {
            width: 100%;

            display: flex;
            justify-content: center;
            align-items: center;

            font-size: 23px;
            font-weight: bold;
            color: white;

            box-sizing: border-box;
            padding-top: 5px;
            padding-bottom: 7px;

            border-radius: 10px;

            &.theme-light {
                background-color: #cf4844;
            }
            &.theme-dark {
                background-color: #0f0f0f;
            }
        }

        & .mydon {
            width: 70%;
            height: auto;
        }
    }

    .taikoProfile-container {
        width: 300px;
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    .ratingScore-container {
        flex: 1 0 auto;

        & :global(.tier), & :global(.rating), & :global(.progress-container .left), & :global(.progress-container .right){
            opacity: 0;
        }
    }
</style>
