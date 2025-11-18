import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import clsx from 'clsx';
import type { FC } from 'react';

import styles from './RedFormWarning.module.scss';
import type { RedFormWarningProps } from './RedFormWarning.types';

export const RedFormWarning: FC<RedFormWarningProps> = ({ error, className }) => {
	return error ? (
		<div className={clsx(styles['c-red-form-warning'], className)}>
			<Icon name={IconNamesLight.Exclamation} />
			{error}
		</div>
	) : (
		// biome-ignore lint/complexity/noUselessFragments: We want to return a ReactElement
		<></>
	);
};
