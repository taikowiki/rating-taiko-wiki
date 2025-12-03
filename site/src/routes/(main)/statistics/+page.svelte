<script lang="ts">
    import { getI18n } from "$lib/module/i18n";
    import { getLang, getTheme } from "$lib/module/layout";
    import ArrowIcon from '$lib/assets/icon/page_arrow1.svg';


    const lang = getLang();
    const i18n = $derived(getI18n($lang));
    const theme = getTheme();
</script>

<div class="statistics-container">
    <h1>{i18n.statistic.title}</h1>
    <div class="card-container">
        <a href="/statistics/dani" class={`card theme-${$theme}`}>
            <h2>{i18n.statistic.dani.title}</h2>
            <img src={ArrowIcon} alt="arrow" class="arrow-icon" />
        </a>
    </div>
</div>

<style lang="scss">
    .statistics-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    h1 {
        font-size: 2rem;
        font-weight: bold;
    }

    .card-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-radius: 10px;
        text-decoration: none;
        color: inherit;
        transition: transform 0.2s;

        &:hover {
            transform: translateY(-5px);
        }

        &.theme-light {
            background-color: #f0f0f0;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        &.theme-dark {
            background-color: #333;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        h2 {
            font-size: 1.25rem;
            margin-bottom: 0;
            font-weight: 600;
            transform: translateY(-2px);
        }

        .arrow-icon {
            height: 1.25rem;
            width: auto;
            transform: rotate(180deg);
        }
    }
</style>
