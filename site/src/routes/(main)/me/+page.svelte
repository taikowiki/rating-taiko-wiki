<script lang="ts">
    import PageTitle from "$lib/components/layout/main/Page-title.svelte";
    import TaikoProfileBadge from "$lib/components/user/Profile/TaikoProfileBadge.svelte";
    import TaikoProfileCrown from "$lib/components/user/Profile/TaikoProfileCrown.svelte";
    import TaikoProfileNameplate from "$lib/components/user/Profile/TaikoProfileNameplate.svelte";
    import { getI18n } from "$lib/module/i18n/index.js";
    import { getIsMobile, getLang, getProfile } from "$lib/module/layout";
    import { userRequestor } from "$lib/module/user/client.js";
    import { alertDialog } from "$lib/module/util/client.js";

    let { data } = $props();
    let profile = $state(data.profile);
    let taikoProfile = $state(data.taikoProfile);
    let profileOption = $state(data.profileOption ?? { hideDan: false });

    const isMobile = getIsMobile();
    const profileStore = getProfile();
    const lang = getLang();
    let i18n = $derived(getI18n($lang).me);

    async function updateProfile() {
        const result = await userRequestor.updateProfile({
            ...profile,
            option: profileOption,
        });
        if (result.status === "success") {
            alertDialog(i18n.success_alert);
            profileStore.set(profile);
        } else {
            alertDialog(i18n.error_alert);
        }
    }

    async function deleteData() {
        if (!window.confirm("Do you really want to delete your data?")) {
            return;
        }

        const response = await userRequestor.deleteData();

        if (response.status === "success") {
            alert("Successfully deleted.");
            location.href = "/";
        } else {
            alert("An error occured.");
        }
    }
</script>

<PageTitle title={i18n.title} />

<h1>{i18n.profile}</h1>
<div class="profile-container">
    <label class="nickname">
        <div>{i18n.nickname}</div>
        <input
            class="standard"
            type="text"
            placeholder={i18n.nickname_placeholder}
            bind:value={profile.nickname}
            maxlength="20"
        />
    </label>
    <label class="bio">
        <div>{i18n.bio}</div>
        <textarea class="standard" bind:value={profile.bio}></textarea>
    </label>
    <div>
        <input type="checkbox" bind:checked={profileOption.hideDan} />
        {i18n.hideDan}
    </div>
    <button class="standard" onclick={updateProfile}>{i18n.save}</button>
</div>

{#if taikoProfile}
    <h1>{i18n.taiko_profile}</h1>
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

<button class="standard" onclick={deleteData}>Delete all your datas.</button>

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
