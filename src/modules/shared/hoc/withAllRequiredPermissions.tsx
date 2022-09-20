import { useRouter } from 'next/router';
import { ComponentType, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Permission } from '@account/const';
import { checkLoginAction, selectCheckLoginLoading, selectHasCheckedLogin } from '@auth/store/user';
import { ErrorNoAccess } from '@shared/components';
import Loading from '@shared/components/Loading/Loading';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useAppDispatch } from '@shared/store';

export const withAllRequiredPermissions = (
	WrappedComponent: ComponentType,
	...requiredPermissions: Permission[]
): ComponentType => {
	return function ComponentWithPermissions(props: Record<string, unknown>) {
		const dispatch = useAppDispatch();
		const router = useRouter();
		const { tHtml } = useTranslation();

		const hasRequiredPermissions: boolean = useHasAllPermission(...requiredPermissions);
		const hasCheckedLogin: boolean = useSelector(selectHasCheckedLogin);
		const checkLoginLoading: boolean = useSelector(selectCheckLoginLoading);

		useEffect(() => {
			if (!checkLoginLoading && !hasCheckedLogin) {
				dispatch(checkLoginAction());
			}
		}, [router, hasRequiredPermissions, tHtml, hasCheckedLogin, checkLoginLoading, dispatch]);

		if (hasCheckedLogin && !hasRequiredPermissions) {
			return (
				<ErrorNoAccess
					visitorSpaceSlug={null}
					description={tHtml(
						'modules/shared/components/error-no-access/error-no-access___je-hebt-geen-toegang-tot-deze-pagina'
					)}
				/>
			);
		}

		if (!hasRequiredPermissions) {
			return <Loading fullscreen />;
		}
		return <WrappedComponent {...props} />;
	};
};
