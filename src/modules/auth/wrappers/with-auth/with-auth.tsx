import { useRouter } from 'next/router';
import { stringify } from 'query-string';
import { ComponentType, useCallback, useEffect, useState } from 'react';

import { AuthMessage, AuthService } from '@auth/services/auth-service';
import { SHOW_AUTH_QUERY_KEY } from '@home/const';
import Loading from '@shared/components/Loading/Loading';
import { REDIRECT_TO_QUERY_KEY, ROUTES } from '@shared/const';
import { TosService } from '@shared/services/tos-service';
import { isCurrentTosAccepted } from '@shared/utils';

export const withAuth = (
	WrappedComponent: ComponentType,
	requireTosAccepted = true
): ComponentType => {
	return function ComponentWithAuth(props: Record<string, unknown>) {
		const router = useRouter();
		const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

		const checkLoginStatus = useCallback(async (): Promise<void> => {
			const login = await AuthService.checkLogin();
			const tos = await TosService.getTos();

			const params = {
				[REDIRECT_TO_QUERY_KEY]: router.asPath,
			};

			const toTermsOfService = async () => {
				return router.push(`${ROUTES.termsOfService}?${stringify(params)}`);
			};

			const toHome = async () => {
				return router.push(
					`${ROUTES.home}?${stringify({
						...params,
						[SHOW_AUTH_QUERY_KEY]: '1',
					})}`
				);
			};

			if (!login?.userInfo || login.message === AuthMessage.LoggedOut) {
				// When the user isn't present in the response or the response states they've logged out
				await toHome();
			} else {
				// When the user is present in the response, they've not logged out
				if (
					!requireTosAccepted ||
					isCurrentTosAccepted(login.userInfo.acceptedTosAt, tos?.updatedAt)
				) {
					// Page does not require accepting the TOS or the user accepted the latest version of the TOS
					setIsLoggedIn(true);
				} else {
					// When the user has not accepted the TOS or accepted a previous version of the TOS
					await toTermsOfService();
				}
			}
		}, []); // eslint-disable-line react-hooks/exhaustive-deps

		useEffect(() => {
			checkLoginStatus();
		}, [checkLoginStatus]);

		if (!isLoggedIn) {
			return <Loading fullscreen />;
		}

		return <WrappedComponent {...props} />;
	};
};
