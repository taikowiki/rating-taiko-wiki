# Project Analysis: Taiko no Tatsujin Unofficial Rating (rating.taiko.wiki)

This document summarizes a thorough analysis of the `rating.taiko.wiki` project, detailing its architecture, key technologies, data flow, and functional components.

## 1. Project Overview

`rating.taiko.wiki` is a full-stack web application designed to provide an unofficial skill rating system for players of the arcade music game 'Taiko no Tatsujin'. It processes user play data, scraped from the official 'Donder Hiroba' website, to calculate and display skill ratings, performance statistics, and global rankings.

## 2. Core Architecture & Technologies

*   **Framework**: SvelteKit (TypeScript)
*   **Backend Runtime**: Node.js (via `@sveltejs/adapter-node`)
*   **Database**: MariaDB (schema defined in `sql/taiko_rating.sql`), accessed via `@yowza/db-handler`.
*   **Key Libraries**:
    *   `@sveltejs/kit`: Core SvelteKit framework.
    *   `@taiko-wiki/taiko-rating`: Contains the core business logic for rating calculation.
    *   `hiroba-js`: Used for scraping data from the official 'Donder Hiroba' website.
    *   `@yowza/db-handler`: Database interaction layer.
    *   `@sveltekit-board/oauth`: Likely used for user authentication/authorization.
    *   `zod`: Schema validation.
    *   `LZUTF8`: Data compression/decompression.
    *   `chart.js`, `html2canvas`, `marked`: Frontend utilities.

## 3. Data Flow and User Interaction Workflow

The project employs a unique and intelligent architecture for data acquisition, prioritizing user privacy and avoiding direct credential handling on the server.

1.  **User Onboarding & Login**:
    *   Users log into `rating.taiko.wiki`. If they are new or haven't set up their profile, they are guided to a `/start` page.
    *   Authentication is handled via an external `taiko.wiki` OAuth service.
2.  **Client-Side Data Scraping (Userscript)**:
    *   The core data collection occurs through an external `upload-script/index.ts`. This script is designed to be executed by the user directly within their browser while on the official `donderhiroba.jp` website.
    *   When executed, the script injects a UI element onto the 'Donder Hiroba' page.
    *   Upon user initiation (e.g., clicking an "Upload" button), the script uses `hiroba-js` to programmatically navigate and scrape the user's play records, Dan-i Dojo progress, and other profile details from the official site.
    *   It intelligently uses `localStorage` to cache previously scraped data, optimizing subsequent uploads.
3.  **Data Transmission**:
    *   The scraped data (including user's Taiko profile and detailed score data) is compiled into a JSON object.
    *   This JSON object is then compressed using `LZUTF8` and sent as a Base64 encoded string to a public API endpoint on `rating.taiko.wiki`: `POST /api/v1/rating/upload`.
4.  **Backend Data Processing & Rating Calculation**:
    *   The `site/src/routes/api/v1/rating/upload/+server.ts` endpoint receives the compressed data.
    *   It decompresses the data and validates its structure using `zod`.
    *   The user's Taiko profile is updated in the database.
    *   Existing user rating data is fetched, and new `scoreData` from the upload is merged with it.
    *   The `@taiko-wiki/taiko-rating` library's `calcualteRating` function is invoked to compute the user's overall rating score and individual song rating data, using song difficulty "measures" fetched from the library.
    *   The user's rating history is updated, and their new global ranking is determined.
5.  **Database Storage**:
    *   All processed data, including updated user profiles, merged score data, song rating data, and overall rating history, is persisted to the MariaDB database using `userDBController` and the `@yowza/db-handler` abstraction.
    *   Request logging is performed for every request into a `log` table.
6.  **User Profile Display**:
    *   The frontend (SvelteKit pages like `/me`, `/user/[UUID]`, `/ranking`) retrieves and displays the calculated ratings and statistics to the user.

## 4. Key Directories and Files

*   **`site/`**: The main SvelteKit application.
    *   `site/package.json`: Defines dependencies (SvelteKit, `hiroba-js`, `@taiko-wiki/taiko-rating`, `@yowza/db-handler`).
    *   `site/svelte.config.js`: SvelteKit configuration, confirms Node.js adapter.
    *   `site/src/hooks.server.ts`: Global server-side hooks for authentication, data loading, theme handling, CORS, and request logging.
    *   `site/src/lib/module/db/server.ts`: Centralized database connection and schema definition, includes data conversion logic.
    *   `site/src/routes/(main)/start/+page.server.ts`: Handles user onboarding, redirects logged-in users without a profile.
    *   `site/src/routes/api/private/profile/+server.ts`: API for updating basic user profile.
    *   `site/src/routes/api/v1/rating/upload/+server.ts`: Critical backend API for receiving, decompressing, processing, and saving uploaded Donder Hiroba data and calculated ratings.
*   **`sql/taiko_rating.sql`**: Defines the MariaDB database schema for all application tables (e.g., `user/profile`, `user/taiko_profile`, `user/score_data`, `user/rating_data`, `log`).
*   **`upload-script/index.ts`**: The client-side userscript responsible for scraping data from Donder Hiroba, compressing it, and sending it to the backend API.
*   **`docs/`**: Contains project documentation in multiple languages (Korean, English, Japanese).
*   **`statistics/user data/sortUserData.ts`**: Likely an auxiliary script for data analysis or processing.

## 5. Conclusion

The `rating.taiko.wiki` project is a well-structured SvelteKit application that leverages a clever client-side scraping mechanism to provide a robust unofficial rating system for Taiko no Tatsujin players. Its use of clear module separation, strong typing (TypeScript, Zod), and a distinct data processing pipeline makes it maintainable and scalable.

## 6. Theming and Internationalization (i18n) Implementation

The project implements both theming and internationalization using a consistent and modular approach within the SvelteKit framework.

### 6.1. Theming

The theming mechanism allows the application to dynamically switch between different visual themes (e.g., light and dark mode).

1.  **Theme State Management**:
    *   The current theme (e.g., 'light' or 'dark') is managed via a Svelte store, accessed through the `getTheme()` function located in `$lib/module/layout`. This store provides a reactive way to track the user's selected theme across the application.

2.  **Dynamic Class Application**:
    *   In Svelte components, the `class` attribute is dynamically bound to include a theme-specific class. For instance, an element might have a class binding like `class={'card theme-${$theme}'}`. When the `$theme` store's value changes, the class on the element updates accordingly (e.g., `theme-light` or `theme-dark`).

3.  **CSS Styling**:
    *   The component's `<style lang="scss">` block contains SCSS rules that target these dynamically applied theme classes. These rules define specific styles (e.g., `background-color`, `box-shadow`) that apply only when the element has a particular theme class, ensuring the visual appearance changes with the selected theme.

    ```scss
    .card {
        /* Common styles for the card */

        &.theme-light {
            background-color: #f0f0f0; /* Light theme specific styles */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        &.theme-dark {
            background-color: #333;   /* Dark theme specific styles */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
    }
    ```

### 6.2. Internationalization (i18n)

The internationalization (i18n) mechanism enables the application to display content in multiple languages based on user preference.

1.  **Language State Management**:
    *   The currently selected language code (e.g., 'en', 'ko', 'ja') is managed by a Svelte store, accessible via the `getLang()` function from `$lib/module/layout`.

2.  **Translation Data Retrieval**:
    *   The `getI18n()` function, located in `$lib/module/i18n`, takes the current language code as an argument. It returns a Svelte derived store (`i18n`) that contains all the translated strings for that specific language. The use of `$derived` ensures that the translation data reactively updates whenever the language store changes.

3.  **Dynamic Text Display**:
    *   In Svelte templates, content is displayed by referencing keys within the `i18n` object. For example, `{i18n.statistic.title}` will display the translated title for the "statistics" section based on the active language. This abstraction ensures that the correct text is shown without needing conditional logic in the template.

    ```html
    <h1>{i18n.statistic.title}</h1>
    <h2>{i18n.statistic.dani.title}</h2>
    ```