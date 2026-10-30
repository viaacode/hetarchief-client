import { vi } from 'vitest';

vi.mock('@shared/config/public-runtime-config', () => ({
	default: () => ({
		publicRuntimeConfig: {
			CLIENT_URL: '/client-url',
			PROXY_URL: '/proxy-url',
			ASSET_SERVER_IMAGE_CACHE_URL: 'https://assets-qas.hetarchief.be/hetarchiefv3/IMAGE_CACHE',
			FLOW_PLAYER_TOKEN: 'my-flowplayer-token',
			FLOW_PLAYER_ID: 'some-id',
			GOOGLE_TAG_MANAGER_ID: 'GTM-MKDR4BQ',
		},
	}),
}));
