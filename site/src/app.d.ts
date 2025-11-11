// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { User as UserModule } from "$lib/module/user";
import { User } from "@sveltekit-board/oauth";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: User<any>;
			userData: UserModule.Data | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	namespace NodeJS {
		interface ProcessEnv {
			WIKI_DB_HOST: string;
			WIKI_DB_PORT: string;
			WIKI_DB_DATABASE: string;
			WIKI_DB_USER: string;
			WIKI_DB_TIMEZONE: string;
			WIKI_DB_PASSWORD: string;
			AUTH_KEY: string;
			TIMEZONE: string;
		}
	}
	interface Window {
		localStorage: KeyedStorage<'theme'>;
	}
}

interface KeyedStorage<Keys extends string> extends Storage {
	getItem(key: Keys | (string & {})): string | null;
	removeItem(key: Keys | (string & {})): void;
	setItem(key: Keys | (string & {}), value: string): void;
}

export { };
