import ky from 'ky-universal';
import { Options } from 'ky/distribution';
import { StringifiableRecord, stringify, stringifyUrl } from 'query-string';

import { config } from '@config/const';
import { ApiService } from '@shared/services';

import { AUTH_BASE_URL } from './auth.service.const';
import { CheckLoginResponse } from './auth.service.types';

class AuthService extends ApiService {
	public async checkLogin(options: Options = {}, isSSR?: boolean): Promise<CheckLoginResponse> {
		// Absolute url is necessary for accessing the proxy on the server side
		const kyOptions = isSSR
			? { ...options, prefixUrl: `${config.public.origin}/${this.baseUrl}` }
			: options;
		return await this.api('check-login', kyOptions).json();
	}

	public redirectToLogin(query: StringifiableRecord) {
		const returnToUrl = stringifyUrl({ url: config.public.origin, query });

		window.location.href = `${this.baseUrl}/hetarchief/login?${stringify({
			returnToUrl,
		})}`;
	}

	public logout() {
		const returnToUrl = config.public.origin;

		window.location.href = `${this.baseUrl}/global-logout?${stringify({
			returnToUrl,
		})}`;
	}
}

export const authService = new AuthService(AUTH_BASE_URL);
