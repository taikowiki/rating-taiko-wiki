<script lang="ts">
    import { goto } from "$app/navigation";
    import PageTitle from "$lib/components/layout/main/Page-title.svelte";
    import TaikoProfileBadge from "$lib/components/user/Profile/TaikoProfileBadge.svelte";
    import TaikoProfileCrown from "$lib/components/user/Profile/TaikoProfileCrown.svelte";
    import TaikoProfileNameplate from "$lib/components/user/Profile/TaikoProfileNameplate.svelte";
    import { getIsMobile, getProfile } from "$lib/module/layout";
    import { userRequestor } from "$lib/module/user/client.js";
    import { alertDialog } from "$lib/module/util/client.js";

    let { data } = $props();
    let profile = $state(data.profile);
    let agree = $state(false);

    const isMobile = getIsMobile();
    const profileStore = getProfile();

    async function updateProfile() {
        if(!agree) return;

        const result = await userRequestor.updateProfile(profile);
        if (result.status === "success") {
            profileStore.set(profile);
            await goto('/myrating');
        } else {
            alertDialog("오류가 발생했습니다.");
        }
    }
</script>

<PageTitle title="시작하기" />

<h1>시작하기</h1>
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
    <div>
        <ul>
            <li>
                사용자는 <a href="//donderhiroba.jp">동더히로바</a>에서 확인할
                수 있는 다음 데이터들을 이 사이트에 업로드할 수 있습니다.
                <ul>
                    <li>닉네임</li>
                    <li>북 번호</li>
                    <li>단위 도장 합격 데이터</li>
                    <li>모든 곡의 각 난이도의 플레이 기록</li>
                </ul>
            </li>
            <li>
                사용자가 업로드한 데이터는 <a href="//taiko.wiki/auth/user"
                    >이곳</a
                >에서 회원 탈퇴 시 모두 삭제됩니다.
            </li>
            <li>사용자가 업로드한 데이터는 모두 공개될 수 있습니다.</li>
            <li>
                사용자가 업로드한 데이터는 익명화된 형태로 통계 분석에 사용될 수
                있습니다.
            </li>
        </ul>
        <input type="checkbox" bind:checked={agree} />
        위 조항들에 동의합니다.
    </div>
    <button class="standard" onclick={updateProfile} disabled={!agree}>시작하기</button>
</div>

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

    ul {
        padding-left: 20px;
    }
</style>
