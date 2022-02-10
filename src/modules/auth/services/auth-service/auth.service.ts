import { Options } from 'ky/distribution/types/options';
import getConfig from 'next/config';
import { StringifiableRecord, stringifyUrl } from 'query-string';

import { config } from '@config/const';
import { ApiService } from '@shared/services';

import { CheckLoginResponse } from './auth.service.types';

const { publicRuntimeConfig } = getConfig();

export class AuthService extends ApiService {
	public static async checkLogin(options: Options = {}): Promise<CheckLoginResponse> {
		return await ApiService.getApi().get(`auth/check-login`, options).json();
	}

	public static redirectToLogin(query: StringifiableRecord): void {
		const returnToUrl = stringifyUrl({
			url: config.public.origin,
			query,
		});

		window.location.href = stringifyUrl({
			url: `${publicRuntimeConfig.PROXY_URL}/auth/hetarchief/login`,
			query: {
				returnToUrl,
			},
		});
	}

	public static logout(): void {
		const returnToUrl = config.public.origin;

		window.location.href = stringifyUrl({
			url: `${publicRuntimeConfig.PROXY_URL}/auth/global-logout`,
			query: {
				returnToUrl,
			},
		});
	}
}
