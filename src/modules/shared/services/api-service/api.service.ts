import { AuthService } from '@auth/services/auth-service';
import type { KyInstance } from 'ky/distribution/types/ky';
import ky from 'ky-universal';


export abstract class ApiService {
	private static api: KyInstance | null = null;

	public static getApi(ignoreAuthError = false): KyInstance {
		if (!ApiService.api) {
			ApiService.api = ky.create({
				prefixUrl: process.env.PROXY_URL,
				timeout: 30000,
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
		return ApiService.api as KyInstance;
	}
}
