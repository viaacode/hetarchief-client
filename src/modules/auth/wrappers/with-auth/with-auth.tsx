import { useRouter } from 'next/router';
import { stringify } from 'query-string';
import { type ComponentType, useCallback, useEffect, useState } from 'react';

import { GroupName } from '@account/const';
import { AuthMessage, AuthService } from '@auth/services/auth-service';
import { Loading } from '@shared/components/Loading';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { TosService } from '@shared/services/tos-service';
import { isCurrentTosAccepted } from '@shared/utils/tos';

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
		const locale = useLocale();

		const [canView, setCanView] = useState<boolean>(false);

		// biome-ignore lint/correctness/useExhaustiveDependencies: render loop if we add router to the dep array
		const checkLoginStatus = useCallback(async (): Promise<void> => {
			const login = await AuthService.checkLogin();
			const tos = await TosService.getTos();

			const params = {
				[QUERY_PARAM_KEY.REDIRECT_TO_QUERY_KEY]: router.asPath.replace(/^\/nl/, ''),
			};

			const toTermsOfService = async () => {
				return router.replace(`${ROUTES_BY_LOCALE[locale].userPolicy}?${stringify(params)}`);
			};

			const toHome = async () => {
				return router.replace(
					`${ROUTES_BY_LOCALE[locale].home}?${stringify({
						...params,
						[QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY]: '1',
					})}`
				);
			};

			if (!login?.userInfo || login.message === AuthMessage.LoggedOut) {
				// User is logged out
				if (isLoginRequired) {
					// Login is required => redirect to home
					await toHome();
				} else {
					// User is logged out, but the page can be seen without logging in
					setCanView(true);
				}
			} else {
				// User is logged in
				// }
				if (
					isCurrentTosAccepted(login.userInfo.acceptedTosAt, tos?.updatedAt) ||
					login.userInfo.groupName === GroupName.KIOSK_VISITOR
				) {
					// User has accepted the latest version of the terms of service
					setCanView(true);
				} else {
					// When the user has not accepted the TOS or accepted a previous version of the TOS => show terms of service
					await toTermsOfService();
				}
			}
		}, []);

		useEffect(() => {
			checkLoginStatus();
		}, [checkLoginStatus]);

		if (!canView) {
			return <Loading fullscreen owner={'withAuth'} />;
		}
		return <WrappedComponent {...props} />;
	};
};
