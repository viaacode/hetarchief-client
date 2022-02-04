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
