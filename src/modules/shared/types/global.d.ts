/// <reference types="next" />

// Extend the NodeJS namespace with Next.js-defined properties
declare namespace NodeJS {
	interface ProcessEnv {
		readonly NODE_ENV: 'development' | 'production' | 'test';
		readonly PORT: 'string';
		readonly ORIGIN: 'string';
		readonly PROXY_URL: 'string';
	}
}
