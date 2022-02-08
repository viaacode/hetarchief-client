export const config = Object.freeze({
	proxyUrl: process.env.PROXY_URL,
	public: {
		origin: process.env.NEXT_PUBLIC_ORIGIN,
	},
} as const);
