/// <reference types="next" />

// Extend the NodeJS namespace with Next.js-defined properties
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly NODE_ENV: 'development' | 'production' | 'test';
			readonly CLIENT_URL: string;
			readonly SSUM_EDIT_ACCOUNT_URL: string;
			readonly PORT: string;
			readonly PROXY_URL: string;
			readonly DEBUG_TOOLS: 'true' | 'false';
			readonly ZENDESK_KEY: string;
			readonly FLOW_PLAYER_TOKEN: string;
			readonly FLOW_PLAYER_ID: string;
			readonly GOOGLE_TAG_MANAGER_ID: string | null;
		}
	}
}

export {};
