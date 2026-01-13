import type { Permission } from '@account/const';
import { checkLoginAction, selectCheckLoginLoading, selectHasCheckedLogin } from '@auth/store/user';
import { ErrorNoAccess } from '@shared/components/ErrorNoAccess';
import { tHtml } from '@shared/helpers/translate';
import { useHasAllPermission, useHasAnyPermission } from '@shared/hooks/has-permission';
import { useAppDispatch } from '@shared/store';
import { useRouter } from 'next/router';
import { type FC, type ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Loading from '../Loading/Loading';

type PermissionsCheckProps = {
	children: ReactElement;
	allPermissions?: Permission[];
	anyPermissions?: Permission[];
};

const PermissionsCheck: FC<PermissionsCheckProps> = ({
	children,
	allPermissions = [],
	anyPermissions = [],
}): ReactElement => {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const hasAllRequiredPermissions: boolean = useHasAllPermission(...allPermissions);
	const hasAnyRequiredPermissions: boolean = useHasAnyPermission(...anyPermissions);
	const hasCheckedLogin: boolean = useSelector(selectHasCheckedLogin);
	const checkLoginLoading: boolean = useSelector(selectCheckLoginLoading);

	const hasRequiredPermissions = hasAllRequiredPermissions && hasAnyRequiredPermissions;

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want to update as such
	useEffect(() => {
		if (!checkLoginLoading && !hasCheckedLogin) {
			// biome-ignore lint/suspicious/noExplicitAny: No typing yet
			dispatch(checkLoginAction() as any);
		}
	}, [router, hasRequiredPermissions, hasCheckedLogin, checkLoginLoading, dispatch]);

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
		return <Loading fullscreen owner="permission check" />;
	}
	return children;
};

export default PermissionsCheck;
