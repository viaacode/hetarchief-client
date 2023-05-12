import { useRouter } from 'next/router';
import { stringify } from 'query-string';
import { ComponentType, useCallback, useEffect, useState } from 'react';

import { GroupName } from '@account/const';
import { AuthMessage, AuthService } from '@auth/services/auth-service';
import Loading from '@shared/components/Loading/Loading';
import { ROUTES } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { TosService } from '@shared/services/tos-service';
import { isBrowser, isCurrentTosAccepted } from '@shared/utils';

/**
 * Checks the users login status
 * If the user is logged in
 * 	- YES => check if he has accepted the latest version of the terms of service
 * 	     - YES => show the page
 * 	     - No  => show the terms of service
 *  - NO  => is loginIsRequired true?
 *       - YES => redirect user to homepage with login modal and redirection path to redirect the user after login
 *       - NO  => show the requested page to the user
 * @param WrappedComponent React component that renders the page
 * @param isLoginRequired boolean
 */
export const withAuth = (
	WrappedComponent: ComponentType,
	isLoginRequired: boolean
): ComponentType => {
	return function ComponentWithAuth(props: Record<string, unknown>) {
		const router = useRouter();
		const [showPage, setShowPage] = useState<boolean>(false);

		const checkLoginStatus = useCallback(async (): Promise<void> => {
			const login = await AuthService.checkLogin();
			const tos = await TosService.getTos();

			const params = {
				[QUERY_PARAM_KEY.REDIRECT_TO_QUERY_KEY]: router.asPath,
			};

			const toTermsOfService = async () => {
				return router.replace(`${ROUTES.termsOfService}?${stringify(params)}`);
			};

			const toHome = async () => {
				return router.replace(
					`${ROUTES.home}?${stringify({
						...params,
						[QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY]: '1',
					})}`
				);
			};

			const toSearchPage = async () => {
				return router.replace(ROUTES.search);
			};

			if (!login?.userInfo || login.message === AuthMessage.LoggedOut) {
				// User is logged out
				if (isLoginRequired) {
					// Login is required => redirect to home
					await toHome();
				} else {
					// User is logged out, but the page can be seen without logging in
					setShowPage(true);
				}
			} else {
				// User is logged in
				if (login.userInfo.groupName === GroupName.KIOSK_VISITOR) {
					// User is kioskuser
					await toSearchPage();
				}
				if (
					isCurrentTosAccepted(login.userInfo.acceptedTosAt, tos?.updatedAt) ||
					login.userInfo.groupName === GroupName.KIOSK_VISITOR
				) {
					// User has accepted the latest version of the terms of service
					setShowPage(true);
				} else {
					// When the user has not accepted the TOS or accepted a previous version of the TOS => show terms of service
					await toTermsOfService();
				}
			}
		}, []); // eslint-disable-line react-hooks/exhaustive-deps

		useEffect(() => {
			checkLoginStatus();
		}, [checkLoginStatus]);

		// Allow server side rendering to get past this loading screen, so we can determine seo fields on the actual page
		return !isBrowser() || showPage ? (
			<WrappedComponent {...props} />
		) : (
			<Loading fullscreen owner="with auth" />
		);
	};
};
