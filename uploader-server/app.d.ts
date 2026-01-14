declare global {
    namespace NodeJS {
        interface ProcessEnv {
            HIROBA_EMAIL: string;
            HIROBA_PASSWORD: string;
            DB_HOST: string;
            DB_DATABASE: string;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_SERVICE: string;
            DB_TIMEZONE: string;
            INTERNAL_API_KEY: string;

            AUTH_KEY: string;
        }
    }
}

export { };