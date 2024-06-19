import clsx from 'clsx';
import { type FC } from 'react';

import styles from './Icon.module.scss';
import { type IconProps } from './Icon.types';

const Icon: FC<IconProps> = ({ className, name, ...rest }) => {
	const [iconName, type] = (name || '').split('--');
	const rootCls = clsx(className, styles['c-icon'], {
		[styles['c-icon--solid']]: type === 'solid',
	});

	if (!type) {
		return null;
	}

	return (
		<span className={rootCls} {...rest}>
			{iconName}
		</span>
	);
};

export default Icon;
