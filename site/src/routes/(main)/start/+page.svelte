<script lang="ts">
    import { goto } from "$app/navigation";
    import PageTitle from "$lib/components/layout/main/Page-title.svelte";
    import { getIsMobile, getProfile, getLang } from "$lib/module/layout";
    import { userRequestor } from "$lib/module/user/client.js";
    import { alertDialog } from "$lib/module/util/client.js";
    import { getI18n } from '$lib/module/i18n';

    let { data } = $props();
    let profile = $state(data.profile);
    let agree = $state(false);

    const lang = getLang();
    const i18n = $derived(getI18n($lang));
    
    const profileStore = getProfile();

    async function updateProfile() {
        if(!agree) return;

        const result = await userRequestor.updateProfile(profile);
        if (result.status === "success") {
            profileStore.set(profile);
            await goto('/myrating');
        } else {
            alertDialog(i18n.start.error_alert.toString());
        }
    }
</script>

<PageTitle title={i18n.start.title.toString()} />

<h1>{i18n.start.title}</h1>
<div class="profile-container">
    <label class="nickname">
        <div>{i18n.start.nickname}</div>
        <input
            class="standard"
            type="text"
            placeholder={i18n.start.nickname_placeholder.toString()}
            bind:value={profile.nickname}
            maxlength="20"
        />
    </label>
    <label class="bio">
        <div>{i18n.start.bio}</div>
        <textarea class="standard" bind:value={profile.bio}></textarea>
    </label>
    <div>
        <ul>
            <li>
                {@html i18n.start.agreement.line1.plain.toString().replaceAll('%s', `<a href="//donderhiroba.jp">${i18n.start.agreement.line1.child}</a>`)}
                <ul>
                    {#each i18n.start.agreement.line1_list as item}
                        <li>{item}</li>
                    {/each}
                </ul>
            </li>
            <li>
                {@html i18n.start.agreement.line2.plain.toString().replaceAll('%s', `<a href="//taiko.wiki/auth/user">${i18n.start.agreement.line2.child}</a>`)}
            </li>
            <li>{i18n.start.agreement.line3}</li>
            <li>{i18n.start.agreement.line4}</li>
        </ul>
        <input type="checkbox" bind:checked={agree} />
        {i18n.start.agreement.agree}
    </div>
    <button class="standard" onclick={updateProfile} disabled={!agree}>{i18n.start.button}</button>
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
