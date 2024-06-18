import { QueryClient } from '@tanstack/react-query';
import { Options } from 'ky/distribution/types/options';
import { omit, trimEnd } from 'lodash-es';
import getConfig from 'next/config';
import { NextRouter } from 'next/router';
import { parseUrl, StringifiableRecord, stringifyUrl } from 'query-string';

import { ROUTE_PARTS_BY_LOCALE, ROUTES_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { ApiService } from '@shared/services/api-service';
import { Locale } from '@shared/utils';
import { SearchFilterId } from '@visitor-space/types';

import { CheckLoginResponse } from './auth.service.types';

const { publicRuntimeConfig } = getConfig();

export class AuthService {
	public static async checkLogin(options: Options = {}): Promise<CheckLoginResponse> {
		const test = await ApiService.getApi().get(`auth/check-login`, options).json();
		return test as CheckLoginResponse;
	}

	public static async redirectToLoginHetArchief(
		query: StringifiableRecord,
		router: NextRouter
	): Promise<void> {
		const ROUTE_PARTS = ROUTE_PARTS_BY_LOCALE[(router.locale || Locale.nl) as Locale];
		const { redirectTo, slug, ie, ...otherQueryParams } = query;
		let originalPath: string = (redirectTo as string) || router.asPath || '';

		// Don't redirect the user back to logout, after they logged in
		if ((originalPath || '').endsWith('/' + ROUTE_PARTS.logout)) {
			originalPath = '/';
		}

		// Redirect /slug to the search page with filter
		if (slug && !ie) {
			// TODO split backend filter names (VisitorSpaceFilterId) from filter names in the url (create a new enum for those)
			originalPath = `/${ROUTE_PARTS.search}?${SearchFilterId.Maintainer}=${slug}`;
		}
		if (
			(originalPath || '') === ROUTES_BY_LOCALE[(router.locale || Locale.nl) as Locale].home
		) {
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
			url: `${publicRuntimeConfig.CLIENT_URL}/${router.locale}/${redirectTo ?? ''}`,
			query: otherQueryParams,
		});

		await router.replace(
			stringifyUrl({
				url: `${publicRuntimeConfig.PROXY_URL}/auth/hetarchief/register`,
				query: {
					returnToUrl,
					locale: router.locale,
				},
			})
		);
	}

	public static async logout(shouldRedirectToOriginalPage = false): Promise<void> {
		let returnToUrl = publicRuntimeConfig.CLIENT_URL;
		if (shouldRedirectToOriginalPage) {
			let originalPath = window.location.href.substring(
				publicRuntimeConfig.CLIENT_URL.length
			);
			const originalPathIsLogoutPath = !!Object.values(ROUTE_PARTS_BY_LOCALE)
				.map((value) => value.logout)
				.find((logoutPart) => originalPath.startsWith(`/${logoutPart}`));
			if (originalPathIsLogoutPath) {
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

		// Clear react-query cache to avoid any pages still being accessible using the browser back button
		// https://meemoo.atlassian.net/browse/ARC-1828
		const queryClient = new QueryClient();
		await queryClient.invalidateQueries();
		queryClient.clear();

		window.location.href = stringifyUrl({
			url: `${publicRuntimeConfig.PROXY_URL}/auth/global-logout`,
			query: {
				returnToUrl,
			},
		});
	}
}
