import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ComponentType, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Permission } from '@account/const';
import { checkLoginAction, selectCheckLoginLoading, selectHasCheckedLogin } from '@auth/store/user';
import Loading from '@shared/components/Loading/Loading';
import { useHasAnyPermission } from '@shared/hooks/has-permission';
import { toastService } from '@shared/services/toast-service';
import { useAppDispatch } from '@shared/store';

export const withAnyRequiredPermissions = (
	WrappedComponent: ComponentType,
	...requiredPermissions: Permission[]
): ComponentType => {
	return function ComponentWithPermissions(props: Record<string, unknown>) {
		const dispatch = useAppDispatch();
		const router = useRouter();
		const { t } = useTranslation();

		const hasRequiredPermissions: boolean = useHasAnyPermission(...requiredPermissions);
		const hasCheckedLogin: boolean = useSelector(selectHasCheckedLogin);
		const checkLoginLoading: boolean = useSelector(selectCheckLoginLoading);

		useEffect(() => {
			if (!checkLoginLoading && !hasCheckedLogin) {
				dispatch(checkLoginAction());
			}
			if (hasCheckedLogin && !hasRequiredPermissions) {
				router.replace('/');
				toastService.notify({
					title: t('pages/account/mijn-historiek/index___geen-toegang'),
					description: t(
						'pages/account/mijn-historiek/index___je-hebt-geen-rechten-om-deze-pagina-te-bekijken'
					),
				});
			}
		}, [router, hasRequiredPermissions, t, hasCheckedLogin, checkLoginLoading, dispatch]);

		if (!hasRequiredPermissions) {
			return <Loading fullscreen />;
		}
		return <WrappedComponent {...props} />;
	};
};
