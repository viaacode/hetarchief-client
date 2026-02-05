import clsx from 'clsx';
import React, { type FC } from 'react';
import styles from './MaxLengthIndicator.module.scss';

interface MaxLengthIndicatorProps {
	value: string | undefined;
	maxLength: number;
}

const MaxLengthIndicator: FC<MaxLengthIndicatorProps> = ({ value, maxLength }) => {
	return (
		<span className={clsx('c-form-control__value-length', styles['c-form-control__value-length'])}>
			{value?.length || 0} / {maxLength}
		</span>
	);
};

export default MaxLengthIndicator;
