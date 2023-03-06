import { Options } from 'ky/distribution/types/options';
import { trimEnd } from 'lodash-es';
import getConfig from 'next/config';
import { NextRouter } from 'next/router';
import { StringifiableRecord, stringifyUrl } from 'query-string';

import { ROUTE_PARTS, ROUTES } from '@shared/const';
import { ApiService } from '@shared/services/api-service';

import { CheckLoginResponse } from './auth.service.types';

const { publicRuntimeConfig } = getConfig();

export class AuthService {
	public static async checkLogin(options: Options = {}): Promise<CheckLoginResponse> {
		return await ApiService.getApi().get(`auth/check-login`, options).json();
	}

	public static async redirectToLoginHetArchief(
		query: StringifiableRecord,
		router: NextRouter
	): Promise<void> {
		const { redirectTo, slug, ...otherQueryParams } = query;
		let originalPath: string = (redirectTo as string) || router.asPath || '';
		if ((originalPath || '').endsWith('/' + ROUTE_PARTS.logout)) {
			originalPath = '/';
		}
		if (slug) {
			originalPath = `/${ROUTE_PARTS.search}/${slug}`;
		}
		if ((originalPath || '') === ROUTES.home) {
			originalPath = `/${ROUTE_PARTS.visit}`;
		}
		const returnToUrl = stringifyUrl({
			url: trimEnd(`${publicRuntimeConfig.CLIENT_URL}${originalPath}`, '/'),
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

	public static async redirectToRegisterHetArchief(
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
				url: `${publicRuntimeConfig.PROXY_URL}/auth/hetarchief/register`,
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

	public static logout(shouldRedirectToOriginalPage = false): void {
		let returnToUrl = publicRuntimeConfig.CLIENT_URL;
		if (shouldRedirectToOriginalPage) {
			let originalPath = window.location.href.substring(
				publicRuntimeConfig.CLIENT_URL.length
			);
			if (originalPath.startsWith(`/${ROUTE_PARTS.logout}`)) {
				originalPath = '/';
			}
			returnToUrl = stringifyUrl({
				url: publicRuntimeConfig.CLIENT_URL,
				query: {
					redirectTo: originalPath,
					showAuth: 1,
				},
			});
		}

		window.location.href = stringifyUrl({
			url: `${publicRuntimeConfig.PROXY_URL}/auth/global-logout`,
			query: {
				returnToUrl,
			},
		});
	}
}
