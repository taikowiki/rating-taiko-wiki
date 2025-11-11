<script lang="ts">
    import { getIsMobile, getTheme, getTimezone } from "$lib/module/layout";
    import { User } from "$lib/module/user";
    import RatingInfo from "../RatingScore/RatingInfo.svelte";
    import RatingScore from "../RatingScore/RatingScore.svelte";
    import TaikoProfile from "./TaikoProfile.svelte";
    import { DateTime } from "luxon";

    interface Props {
        profile: User.Profile;
        taikoProfile: User.TaikoProfile;
        lastUpdate: Date;
        currentRatingScore: number;
        currentExp: number;
        ranking: number;
    }

    let {
        profile,
        taikoProfile,
        lastUpdate,
        currentRatingScore,
        currentExp,
        ranking,
    }: Props = $props();
    let lastUpdateString = $derived(
        DateTime.fromJSDate(lastUpdate, { zone: getTimezone() }).toFormat(
            "yyyy-MM-dd HH:mm:ss",
        ),
    );

    const theme = getTheme();
    const isMobile = getIsMobile();
</script>

<div class="container" class:isMobile={$isMobile}>
    <div class="profile-container" class:isMobile={$isMobile}>
        <div class={`nickname theme-${$theme}`}>
            {profile.nickname}
        </div>
        <TaikoProfile {taikoProfile} />
        {#if !$isMobile}
            <div class="lastupdate">
                마지막 업데이트: {lastUpdateString} (UTC+9)
            </div>
        {/if}
    </div>
    <div class="right-container">
        <RatingScore {currentExp} {currentRatingScore} {ranking} />
        {#if profile.bio}
            <div class={`bio theme-${$theme}`}>
                {profile.bio}
            </div>
        {:else}
            <div class={`no-bio theme-${$theme}`}>
                {"상태메시지가 없습니다."}
            </div>
        {/if}
    </div>
    {#if $isMobile}
        <div class="lastupdate">
            마지막 업데이트: {lastUpdateString} (UTC+9)
        </div>
    {/if}
</div>

<style>
    .container {
        width: 100%;
        max-width: 1000px;
        display: flex;
        column-gap: 20px;

        &.isMobile {
            flex-direction: column;
            row-gap: 10px;
        }
    }

    .profile-container {
        width: 100%;
        max-width: 300px;
        display: flex;
        flex-direction: column;
        row-gap: 10px;

        &.isMobile {
            max-width: 100%;
        }
    }

    .right-container {
        flex: 1 0 auto;
        display:flex;
        flex-direction: column;
        row-gap: 10px;
    }

    .nickname {
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

    .bio,
    .no-bio {
        width: 100%;
        box-sizing: border-box;
        padding: 20px;
        border-radius: 10px;
        flex: 1 0 auto;

        &.theme-light {
            border: 1px solid #cf4844;
        }
        &.theme-dark {
            background-color: #0f0f0f;
        }
    }

    .no-bio {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .lastupdate {
        text-align: center;
        font-size: 13px;
        color: rgb(153, 153, 153);
    }
</style>
