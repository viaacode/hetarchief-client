import { useRouter } from 'next/router';
import { stringify } from 'query-string';
import { ComponentType, useCallback, useEffect, useState } from 'react';

import { AuthMessage, AuthService } from '@auth/services/auth-service';
import { SHOW_AUTH_QUERY_KEY } from '@home/const';
import Loading from '@shared/components/Loading/Loading';

export const withAuth = (WrappedComponent: ComponentType): ComponentType => {
	return function ComponentWithAuth(props: Record<string, unknown>) {
		const router = useRouter();
		const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

		const checkLoginStatus = useCallback(async (): Promise<void> => {
			const response = await AuthService.checkLogin();
			if (!!response?.userInfo && response.message !== AuthMessage.LoggedOut) {
				setIsLoggedIn(true);
			} else {
				await router.push(
					`/?${stringify({ [SHOW_AUTH_QUERY_KEY]: '1', redirectTo: router.asPath })}`
				);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		useEffect(() => {
			checkLoginStatus();
		}, [checkLoginStatus]);

		if (!isLoggedIn) {
			return <Loading fullscreen />;
		}

		return <WrappedComponent {...props} />;
	};
};
