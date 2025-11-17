<script lang="ts">
    import { page } from "$app/state";
    import PageTItle from "$lib/components/layout/main/PageTItle.svelte";
    import TaikoProfileBadge from "$lib/components/user/Profile/TaikoProfileBadge.svelte";
    import TaikoProfileCrown from "$lib/components/user/Profile/TaikoProfileCrown.svelte";
    import TaikoProfileNameplate from "$lib/components/user/Profile/TaikoProfileNameplate.svelte";
    import { getIsMobile, getProfile } from "$lib/module/layout";
    import { userRequestor } from "$lib/module/user/client.js";
    import { alertDialog } from "$lib/module/util/client.js";

    let { data } = $props();
    let profile = $state(data.profile);
    let taikoProfile = $state(data.taikoProfile);

    const isMobile = getIsMobile();
    const profileStore = getProfile();

    async function updateProfile() {
        const result = await userRequestor.updateProfile(profile);
        if (result.status === "success") {
            alertDialog("프로필이 변경되었습니다.");
            profileStore.set(profile);
        } else {
            alertDialog("오류가 발생했습니다.");
        }
    }
</script>

<PageTItle title="내 프로필" />

<h1>프로필</h1>
<div class="profile-container">
    <label class="nickname">
        <div>닉네임</div>
        <input
            class="standard"
            type="text"
            placeholder="닉네임을 입력해주세요"
            bind:value={profile.nickname}
            maxlength="20"
        />
    </label>
    <label class="bio">
        <div>상태 메시지</div>
        <textarea class="standard" bind:value={profile.bio}></textarea>
    </label>
    <button class="standard" onclick={updateProfile}>저장하기</button>
</div>

{#if taikoProfile}
    <h1>태고 프로필</h1>
    <div class={`taikoProfile-container`} class:isMobile={$isMobile}>
        <div class="layer-1">
            <img
                class="mydon"
                src={`https://img.taiko-p.jp/imgsrc.php?v=&kind=mydon&fn=mydon_${taikoProfile.taikoNo}`}
                alt="mydon"
            />
        </div>
        <div class="layer-2">
            <TaikoProfileNameplate
                nickname={taikoProfile.nickname}
                taikoNo={taikoProfile.taikoNo}
                dani={taikoProfile.dani}
            />
            <TaikoProfileCrown crown={taikoProfile.crown} />
            <TaikoProfileBadge badge={taikoProfile.badge} />
        </div>
    </div>
{/if}

<style>
    .profile-container {
        width: 100%;
        max-width: 650px;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        row-gap: 20px;

        & label {
            width: 100%;
            display: flex;
            flex-direction: column;
            row-gap: 5px;
        }
        & textarea {
            resize: vertical;
            font-family: inherit;
        }
    }

    .taikoProfile-container {
        display: flex;
        flex-direction: row;
        column-gap: 10px;
        row-gap: 10px;

        & .layer-1,
        & .layer-2 {
            display: flex;
            flex-direction: column;
            row-gap: 10px;
        }

        & .mydon {
            width: 100%;
            max-width: 232px;
        }
        & .layer-2 {
            width: 100%;
            max-width: 400px;
        }

        &.isMobile {
            flex-direction: column;
            align-items: center;
        }
    }
</style>
