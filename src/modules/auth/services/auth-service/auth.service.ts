import { QueryClient } from '@tanstack/react-query';
import { Options } from 'ky/distribution/types/options';
import { omit, trimEnd } from 'lodash-es';
import getConfig from 'next/config';
import { NextRouter } from 'next/router';
import { parseUrl, StringifiableRecord, stringifyUrl } from 'query-string';

import { ROUTE_PARTS, ROUTES } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { ApiService } from '@shared/services/api-service';
import { isBrowser } from '@shared/utils';
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

		let returnToUrl = trimEnd(`${publicRuntimeConfig.CLIENT_URL}${originalPath}`, '/');
		const parsedRedirectUrl = parseUrl(returnToUrl);
		returnToUrl = stringifyUrl({
			url: parsedRedirectUrl.url,
			query: {
				...parsedRedirectUrl.query,
				...otherQueryParams,
			},
		});

		await router.replace(
			stringifyUrl({
				url: `${
					isBrowser() ? publicRuntimeConfig.PROXY_URL : process.env.PROXY_URL
				}/auth/hetarchief/login`,
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
			url: `${isBrowser() ? publicRuntimeConfig.CLIENT_URL : process.env.CLIENT_URL}/${
				redirectTo ?? ''
			}`,
			query: otherQueryParams,
		});

		await router.replace(
			stringifyUrl({
				url: `${
					isBrowser() ? publicRuntimeConfig.PROXY_URL : process.env.PROXY_URL
				}/auth/hetarchief/register`,
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
			url: `${isBrowser() ? publicRuntimeConfig.CLIENT_URL : process.env.CLIENT_URL}/${
				redirectTo ?? ''
			}`,
			query: otherQueryParams,
		});

		await router.replace(
			stringifyUrl({
				url: `${
					isBrowser() ? publicRuntimeConfig.PROXY_URL : process.env.PROXY_URL
				}/auth/meemoo/login`,
				query: {
					returnToUrl,
				},
			})
		);
	}

	public static async logout(shouldRedirectToOriginalPage = false): Promise<void> {
		let returnToUrl = isBrowser() ? publicRuntimeConfig.CLIENT_URL : process.env.CLIENT_URL;
		if (shouldRedirectToOriginalPage) {
			let originalPath = window.location.href.substring(
				(isBrowser() ? publicRuntimeConfig.CLIENT_URL : process.env.CLIENT_URL).length
			);
			if (originalPath.startsWith(`/${ROUTE_PARTS.logout}`)) {
				originalPath = '/';
			}
			returnToUrl = stringifyUrl({
				url: isBrowser() ? publicRuntimeConfig.CLIENT_URL : process.env.CLIENT_URL,
				query: {
					redirectTo: originalPath,
					showAuth: 1,
				},
			});
		}

		// Clear react-query cache to avoid any pages still being accessible using the browser back button
		// https://meemoo.atlassian.net/browse/ARC-1828
		const queryClient = new QueryClient();
		await queryClient.invalidateQueries();
		queryClient.clear();

		window.location.href = stringifyUrl({
			url: `${
				isBrowser() ? publicRuntimeConfig.PROXY_URL : process.env.PROXY_URL
			}/auth/global-logout`,
			query: {
				returnToUrl,
			},
		});
	}
}
