import clsx from 'clsx';
import { FC } from 'react';

import { ICON_LIGHT, ICON_SOLID } from './Icon.const';
import styles from './Icon.module.scss';
import { IconProps, IconSolidNames } from './Icon.types';

const Icon: FC<IconProps> = ({ className, name, type = 'light', ...rest }) => {
	const rootCls = clsx(className, styles['c-icon'], {
		[styles['c-icon--solid']]: type === 'solid',
	});

	const hasIcon =
		type === 'light' ? ICON_LIGHT.includes(name) : ICON_SOLID.includes(name as IconSolidNames);

	return hasIcon ? (
		<span className={rootCls} {...rest}>
			{name}
		</span>
	) : null;
};

export default Icon;
