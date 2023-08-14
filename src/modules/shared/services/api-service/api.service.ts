import ky from 'ky-universal';
import { KyInstance } from 'ky/distribution/types/ky';
import getConfig from 'next/config';

import { AuthService } from '@auth/services/auth-service';
import { isBrowser } from '@shared/utils';

const { publicRuntimeConfig } = getConfig();

export abstract class ApiService {
	private static api: KyInstance | null = null;

	public static getApi(ignoreAuthError = false): KyInstance {
		if (!ApiService.api) {
			this.api = ky.create({
				prefixUrl: publicRuntimeConfig.PROXY_URL,
				headers: {
					'content-type': 'application/json',
					'Cache-Control': 'no-cache',
				},
				credentials: 'include', // TODO change to same-origin once working on server
				hooks: {
					afterResponse: [
						async (_request, _options, response) => {
							if (response.status === 401 && !ignoreAuthError) {
								// user is unauthorized and should log in again
								await AuthService.logout(true); // true: return to current page after login
							}
						},
					],
				},
			});
		}
		return this.api as KyInstance;
	}
}
