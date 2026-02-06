import { getAdminCoreConfig } from '@admin/wrappers/admin-core-config';
import { selectCommonUser } from '@auth/store/user';
import { type AdminConfig, AdminConfigManager } from '@meemoo/admin-core-ui/admin';
import Loading from '@shared/components/Loading/Loading';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { useRouter } from 'next/router';
import { type ComponentType, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const withAdminCoreConfig = (WrappedComponent: ComponentType): ComponentType => {
	return function withAdminCoreConfig(props: Record<string, unknown>) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [adminCoreConfig, setAdminCoreConfig] = useState<AdminConfig | null>(null);
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const router = useRouter();
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const locale = useLocale();
		const commonUser = useSelector(selectCommonUser);

		// biome-ignore lint/correctness/useExhaustiveDependencies: router changes too ofter and this causes a render loop if we add it to the deps array
		const initConfigValue = useCallback(() => {
			const config = getAdminCoreConfig(router, locale, commonUser);
			AdminConfigManager.setConfig(config);
			setAdminCoreConfig(config);
		}, [locale]);

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			initConfigValue();
		}, [initConfigValue]);

		if (!adminCoreConfig) {
			return (
				<div suppressHydrationWarning>
					<Loading fullscreen locationId="admin-core config not set yet" />
				</div>
			);
		}

		return <WrappedComponent {...props} />;
	};
};
