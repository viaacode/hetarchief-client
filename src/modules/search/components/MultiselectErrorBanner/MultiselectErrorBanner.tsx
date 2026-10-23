import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import type { FC } from 'react';

import styles from './MultiselectErrorBanner.module.scss';

interface MultiselectErrorBannerProps {
	className?: string;
	objectCount: number;
	isRetrying?: boolean;
	onRetry: () => void;
}

/**
 * Shown when saving the selected objects to folders failed, the selection is kept so the user can retry
 */
export const MultiselectErrorBanner: FC<MultiselectErrorBannerProps> = ({
	className,
	objectCount,
	isRetrying = false,
	onRetry,
}) => {
	return (
		<div className={clsx(className, styles['c-multiselect-error-banner'])} role="alert">
			<Icon
				className={styles['c-multiselect-error-banner__icon']}
				name={IconNamesLight.Exclamation}
				aria-hidden
			/>
			<div className={styles['c-multiselect-error-banner__message']}>
				<p className={styles['c-multiselect-error-banner__title']}>
					{tText(
						'modules/search/components/multiselect-error-banner/multiselect-error-banner___toevoegen-mislukt-je-selectie-is-bewaard-probeer-het-opnieuw'
					)}
				</p>
				<p>
					{objectCount === 1
						? tText(
								'modules/search/components/multiselect-error-banner/multiselect-error-banner___er-ging-iets-mis-bij-het-bewaren-van-1-object'
							)
						: tText(
								'modules/search/components/multiselect-error-banner/multiselect-error-banner___er-ging-iets-mis-bij-het-bewaren-van-count-objecten',
								{
									count: objectCount,
								}
							)}
				</p>
			</div>
			<Button
				className={styles['c-multiselect-error-banner__retry']}
				variants={['outline']}
				label={tText(
					'modules/search/components/multiselect-error-banner/multiselect-error-banner___opnieuw-proberen'
				)}
				onClick={onRetry}
				disabled={isRetrying}
			/>
		</div>
	);
};
