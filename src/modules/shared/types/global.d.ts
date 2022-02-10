/// <reference types="next" />

// Extend the NodeJS namespace with Next.js-defined properties
declare namespace NodeJS {
	interface ProcessEnv {
		readonly NODE_ENV: 'development' | 'production' | 'test';
		readonly NEXT_PUBLIC_ORIGIN: 'string';
		readonly PORT: 'string';
		readonly PROXY_URL: 'string';
	}
}

interface Window {
	_ENV_: {
		NODE_ENV: string;
		PORT: string;
		NEXT_PUBLIC_ORIGIN: string;
		NEXT_TELEMETRY_DISABLED: string;
		PROXY_URL: string;
		PROXY_PATH: string;
	};
	APP_INFO: {
		version: string;
		mode: 'development' | 'production' | 'test';
	};
}
