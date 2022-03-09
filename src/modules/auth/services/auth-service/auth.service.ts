import { Options } from 'ky/distribution/types/options';
import getConfig from 'next/config';
import { NextRouter } from 'next/router';
import { StringifiableRecord, stringifyUrl } from 'query-string';

import { ApiService } from '@shared/services';

import { CheckLoginResponse } from './auth.service.types';

const { publicRuntimeConfig } = getConfig();

export class AuthService extends ApiService {
	public static async checkLogin(options: Options = {}): Promise<CheckLoginResponse> {
		return await ApiService.getApi().get(`auth/check-login`, options).json();
	}

	public static async redirectToLoginHetArchief(
		query: StringifiableRecord,
		router: NextRouter
	): Promise<void> {
		const { redirectTo, ...otherQueryParams } = query;
		const returnToUrl = stringifyUrl({
			url: `${publicRuntimeConfig.CLIENT_URL}/${redirectTo ?? ''}`,
			query: otherQueryParams,
		});

		await router.replace(
			stringifyUrl({
				url: `${publicRuntimeConfig.PROXY_URL}/auth/hetarchief/login`,
				query: {
					returnToUrl,
				},
			})
		);
	}

	public static async redirectToLoginMeemoo(
		query: StringifiableRecord,
		router: NextRouter
	): Promise<void> {
		const { redirectTo, ...otherQueryParams } = query;
		const returnToUrl = stringifyUrl({
			url: `${publicRuntimeConfig.CLIENT_URL}/${redirectTo ?? ''}`,
			query: otherQueryParams,
		});

		await router.replace(
			stringifyUrl({
				url: `${publicRuntimeConfig.PROXY_URL}/auth/meemoo/login`,
				query: {
					returnToUrl,
				},
			})
		);
	}

	public static logout(): void {
		const returnToUrl = publicRuntimeConfig.CLIENT_URL;

		window.location.href = stringifyUrl({
			url: `${publicRuntimeConfig.PROXY_URL}/auth/global-logout`,
			query: {
				returnToUrl,
			},
		});
	}
}
