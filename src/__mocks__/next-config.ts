import { jest } from '@jest/globals';

export default jest.mock('next/config', () => () => ({
	publicRuntimeConfig: {
		CLIENT_URL: '/client-url',
		PROXY_URL: '/proxy-url',
		FLOW_PLAYER_TOKEN: 'my-flowplayer-token',
		FLOW_PLAYER_ID: 'some-id',
		GOOGLE_TAG_MANAGER_ID: 'GTM-MKDR4BQ',
	},
}));
