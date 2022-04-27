import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ComponentType, useEffect } from 'react';

import { Permission } from '@account/const';
import Loading from '@shared/components/Loading/Loading';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { toastService } from '@shared/services/toast-service';

export const withAllRequiredPermissions = (
	WrappedComponent: ComponentType,
	...requiredPermissions: Permission[]
): ComponentType => {
	return function ComponentWithPermissions(props: Record<string, unknown>) {
		const hasRequiredPermissions = useHasAllPermission(...requiredPermissions);
		const router = useRouter();
		const { t } = useTranslation();

		useEffect(() => {
			if (!hasRequiredPermissions) {
				router.replace('/');

				toastService.notify({
					title: t('pages/account/mijn-historiek/index___geen-toegang'),
					description: t(
						'pages/account/mijn-historiek/index___je-hebt-geen-rechten-om-deze-pagina-te-bekijken'
					),
				});
			}
		}, [router, hasRequiredPermissions, t]);

		if (!hasRequiredPermissions) {
			return <Loading fullscreen />;
		}
		return <WrappedComponent {...props} />;
	};
};
