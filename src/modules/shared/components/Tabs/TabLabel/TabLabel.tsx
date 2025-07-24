import type { FC } from 'react';

import clsx from 'clsx';
import type { TabLabelProps } from './TabLabel.types';

import styles from './TabLabel.module.scss';

const TabLabel: FC<TabLabelProps> = ({ count, label, showCountOnMobile = false }) => {
	return (
		<>
			<strong>{label}</strong>
			{count !== undefined && (
				<small
					className={clsx(
						'u-ml-8',
						styles['c-tab-label__count'],
						showCountOnMobile && styles['c-tab-label__count--show-on-mobile']
					)}
				>
					({count})
				</small>
			)}
		</>
	);
};

export default TabLabel;
