<script lang="ts">
    import donchan_logo from '$lib/assets/img/logo.png';
    import { getI18n } from '$lib/module/i18n';
    import { getLang, getTheme } from '$lib/module/layout';

    const lang = getLang();
    const theme = getTheme();
    const i18n = $derived(getI18n($lang).main);
</script>

<div class="container" class:theme-dark={$theme === 'dark'}>
    <header class="hero">
        <img src={donchan_logo} alt="Logo" class="logo">
        <h1>{i18n.title}</h1>
        <p class="description">{i18n.description}</p>
        <a href="/start" class="start-button standard">{i18n.start}</a>
    </header>

    <section class="features">
        {#each i18n.features as feature}
            <div class="feature-card">
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
            </div>
        {/each}
    </section>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-block: 40px;
        min-height: 70vh;
    }

    .hero {
        text-align: center;
        margin-bottom: 60px;

        .logo {
            width: 100%;
            max-width: 200px;
            margin-bottom: 20px;
        }

        h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            font-family: sans-serif;
        }

        .description {
            font-size: 1.2rem;
            margin-bottom: 30px;
            opacity: 0.8;
        }

        .start-button {
            display: inline-block;
            padding: 12px 40px;
            font-size: 1.2rem;
            font-weight: bold;
            text-decoration: none;
            transition: transform 0.2s;

            &:hover {
                transform: scale(1.05);
            }
        }
    }

    .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        width: 100%;
        max-width: 1000px;
    }

    .feature-card {
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        transition: background-color 0.3s, border-color 0.3s;

        h2 {
            margin-bottom: 15px;
            font-family: sans-serif;
            font-weight: bolder;
        }

        p {
            opacity: 0.9;
            line-height: 1.6;
        }
    }

    /* Theme specific styles */
    .theme-light {
        .feature-card {
            background-color: #f9f9f9;
            border: 1px solid #eee;
        }
    }

    .theme-dark {
        .feature-card {
            background-color: #333;
            border: 1px solid #444;
            color: white;
        }
    }

    @media (max-width: 600px) {
        .hero h1 {
            font-size: 2rem;
        }
    }
</style>
