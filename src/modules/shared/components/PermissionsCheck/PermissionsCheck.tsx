import { useRouter } from 'next/router';
import { FC, ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Permission } from '@account/const';
import { checkLoginAction, selectCheckLoginLoading, selectHasCheckedLogin } from '@auth/store/user';
import { ErrorNoAccess } from '@shared/components';
import { useHasAllPermission, useHasAnyPermission } from '@shared/hooks/has-permission';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useAppDispatch } from '@shared/store';

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
	const { tHtml } = useTranslation();

	const hasAllRequiredPermissions: boolean = useHasAllPermission(...allPermissions);
	const hasAnyRequiredPermissions: boolean = useHasAnyPermission(...anyPermissions);
	const hasCheckedLogin: boolean = useSelector(selectHasCheckedLogin);
	const checkLoginLoading: boolean = useSelector(selectCheckLoginLoading);

	const hasRequiredPermissions = hasAllRequiredPermissions && hasAnyRequiredPermissions;

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
		return <Loading fullscreen owner="permission check" />;
	}
	return children;
};

export default PermissionsCheck;
