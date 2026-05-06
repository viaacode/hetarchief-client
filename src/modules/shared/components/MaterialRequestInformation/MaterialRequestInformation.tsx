import { selectCommonUser } from '@auth/store/user';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml } from '@shared/helpers/translate';
import { useIsComplexReuseFlowUser } from '@visitor-space/hooks/is-complex-reuse-flow';
import clsx from 'clsx';
import type { FC } from 'react';
import { useSelector } from 'react-redux';
import styles from './MaterialRequestInformation.module.scss';

const MaterialRequestInformation: FC = () => {
	const commonUser = useSelector(selectCommonUser);
	const isComplexReuseFlow = useIsComplexReuseFlowUser(commonUser);

	if (!isComplexReuseFlow) {
		return null;
	}
	return (
		<p className={clsx(styles['c-material-request-information'])}>
			<Icon name={IconNamesLight.Info} aria-hidden />
			{commonUser?.isKeyUser
				? tHtml(
						'modules/shared/components/material-request-information/material-request-information___meer-informatie-over-aanvragen-sleutel-gebruiker'
					)
				: tHtml(
						'modules/shared/components/material-request-information/material-request-information___meer-informatie-over-aanvragen'
					)}
		</p>
	);
};

export default MaterialRequestInformation;
