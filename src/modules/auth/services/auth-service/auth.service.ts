import { ROUTE_PARTS_BY_LOCALE, ROUTES_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { ApiService } from '@shared/services/api-service';
import { TranslationService } from '@shared/services/translation-service/translation.service';
import { Locale } from '@shared/utils/i18n';
import { QueryClient } from '@tanstack/react-query';
import type { Options } from 'ky/distribution/types/options';
import { omit, trimEnd } from 'lodash-es';
import type { NextRouter } from 'next/router';
import { parseUrl, type StringifiableRecord, stringifyUrl } from 'query-string';

import type { CheckLoginResponse } from './auth.service.types';


export class AuthService {
	public static async checkLogin(options: Options = {}): Promise<CheckLoginResponse> {
		const response = await ApiService.getApi().get('auth/check-login', options).json();
		return response as CheckLoginResponse;
	}

	public static async updateLanguagePreference(newLocale: Locale): Promise<void> {
		await ApiService.getApi().patch('users/update-language', {
			body: JSON.stringify({ language: newLocale }),
		});
	}

	public static async redirectToLoginHetArchief(
		query: StringifiableRecord,
		router: NextRouter
	): Promise<void> {
		const ROUTE_PARTS = ROUTE_PARTS_BY_LOCALE[(router.locale || Locale.nl) as Locale];
		const { redirectTo, ...otherQueryParams } = query;
		let originalPath: string = (redirectTo as string) || router.asPath || '';

		// Don't redirect the user back to logout, after they logged in
		if ((originalPath || '').endsWith(`/${ROUTE_PARTS.logout}`)) {
			originalPath = '/';
		}

		if ((originalPath || '') === ROUTES_BY_LOCALE[(router.locale || Locale.nl) as Locale].home) {
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

		let returnToUrl = trimEnd(`${process.env.CLIENT_URL}/${router.locale}${originalPath}`, '/');
		const parsedRedirectUrl = parseUrl(returnToUrl);
		returnToUrl = stringifyUrl({
			url: parsedRedirectUrl.url,
			query: {
				...parsedRedirectUrl.query,
				...omit(otherQueryParams, 'slug'),
			},
		});

		await router.replace(
			stringifyUrl({
				url: `${process.env.PROXY_URL}/auth/hetarchief/login`,
				query: {
					returnToUrl,
					language: router.locale,
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
			url: `${process.env.CLIENT_URL}/${router.locale}/${redirectTo ?? ''}`,
			query: otherQueryParams,
		});

		await router.replace(
			stringifyUrl({
				url: `${process.env.PROXY_URL}/auth/hetarchief/register`,
				query: {
					returnToUrl,
					locale: router.locale,
				},
			})
		);
	}

	public static async logout(shouldRedirectToOriginalPage = false): Promise<void> {
		const locale = TranslationService.getLocale();
		let returnToUrl = `${process.env.CLIENT_URL}/${locale}`;
		if (shouldRedirectToOriginalPage) {
			let originalPath = window.location.href.substring(process.env.CLIENT_URL.length);
			const originalPathIsLogoutPath = !!Object.values(ROUTE_PARTS_BY_LOCALE)
				.map((value) => value.logout)
				.find((logoutPart) => originalPath.startsWith(`/${logoutPart}`));
			if (originalPathIsLogoutPath) {
				originalPath = '/';
			}
			returnToUrl = stringifyUrl({
				url: `${process.env.CLIENT_URL}/${locale}`,
				query: {
					redirectTo: `/${locale}${originalPath}`,
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
			url: `${process.env.PROXY_URL}/auth/global-logout`,
			query: {
				returnToUrl,
			},
		});
	}
}
