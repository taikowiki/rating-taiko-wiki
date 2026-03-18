declare global {
    namespace NodeJS {
        interface ProcessEnv {
            HIROBA_EMAIL: string;
            HIROBA_PASSWORD: string;
            INTERNAL_API_KEY: string;
            RATING_URL: string;
            DBMASTER_KEY: string;
            DBMASTER_URL: string;
            AUTH_KEY: string;
            PORT: string;
        }
    }
}

export { };
