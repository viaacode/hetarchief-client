import { type FC } from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

import styles from './RedFormWarning.module.scss';
import { type RedFormWarningProps } from './RedFormWarning.types';

export const RedFormWarning: FC<RedFormWarningProps> = ({ error }) => {
	return error ? (
		<div className={styles['c-red-form-warning']}>
			<Icon name={IconNamesLight.Exclamation} />
			{error}
		</div>
	) : (
		<></>
	);
};
