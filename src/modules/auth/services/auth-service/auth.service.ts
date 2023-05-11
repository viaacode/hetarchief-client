import { Options } from 'ky/distribution/types/options';
import { omit, trimEnd } from 'lodash-es';
import getConfig from 'next/config';
import { NextRouter } from 'next/router';
import { parseUrl, StringifiableRecord, stringifyUrl } from 'query-string';

import { ROUTE_PARTS, ROUTES } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { ApiService } from '@shared/services/api-service';
import { VisitorSpaceFilterId } from '@visitor-space/types';

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
		const { redirectTo, slug, ie, ...otherQueryParams } = query;
		let originalPath: string = (redirectTo as string) || router.asPath || '';

		// Don't redirect the user back to logout, after they logged in
		if ((originalPath || '').endsWith('/' + ROUTE_PARTS.logout)) {
			originalPath = '/';
		}

		// Redirect /slug to the search page with filter
		if (slug && !ie) {
			// TODO split backend filter names (VisitorSpaceFilterId) from filter names in the url (create a new enum for those)
			originalPath = `/${ROUTE_PARTS.search}?${VisitorSpaceFilterId.Maintainer}=${slug}`;
		}
		if ((originalPath || '') === ROUTES.home) {
			originalPath = `/${ROUTE_PARTS.visit}`;
		}

		// Make sure we don't show the auth modal after the idp login redirect
		if (originalPath.includes(QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY)) {
			const parsedUrl = parseUrl(originalPath);
			originalPath = stringifyUrl({
				url: parsedUrl.url,
				query: omit(parsedUrl.query, QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY),
			});
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
