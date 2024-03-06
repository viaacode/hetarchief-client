import { AdminConfigManager } from '@meemoo/admin-core-ui';
import { ComponentType, useCallback, useEffect, useState } from 'react';

import { adminCoreConfig } from '@admin/wrappers/admin-core-config';
import Loading from '@shared/components/Loading/Loading';

/**
 * @deprecated Use initAdminCoreConfig instead
 * @param WrappedComponent
 */
export const withAdminCoreConfig = (WrappedComponent: ComponentType): ComponentType => {
	return function withAdminCoreConfig(props: Record<string, unknown>) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [isAdminCoreConfigInitialized, setIsAdminCoreConfigInitialized] =
			useState<boolean>(false);
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const initConfigValue = useCallback(() => {
			AdminConfigManager.setConfig(adminCoreConfig);
			setIsAdminCoreConfigInitialized(true);
		}, []); // eslint-disable-line react-hooks/exhaustive-deps

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			initConfigValue();
		}, [initConfigValue]);

		if (!isAdminCoreConfigInitialized) {
			return (
				<div suppressHydrationWarning>
					<Loading fullscreen owner="admin-core config not set yet" />
				</div>
			);
		}

		return <WrappedComponent {...props} />;
	};
};
