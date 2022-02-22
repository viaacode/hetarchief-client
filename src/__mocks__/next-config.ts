export default jest.mock('next/config', () => () => ({
	publicRuntimeConfig: {
		CLIENT_URL: '/client-url',
		PROXY_URL: '/proxy-url',
	},
}));
