import type { FC } from 'react';

import clsx from 'clsx';
import type { TabLabelProps } from './TabLabel.types';

const TabLabel: FC<TabLabelProps> = ({ count, label }) => {
	return (
		<>
			<strong>{label}</strong>
			{count !== undefined && (
				<small className={clsx('u-ml-8', 'c-tab-label__count')}>({count})</small>
			)}
		</>
	);
};

export default TabLabel;
