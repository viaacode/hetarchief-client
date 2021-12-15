import clsx from 'clsx';
import { FC } from 'react';

import { ICON_LIGHT, ICON_SOLID } from './Icon.const';
import styles from './Icon.module.scss';
import { IconProps } from './Icon.types';

import { IconSolidNames } from '.';

const Icon: FC<IconProps> = ({ name, type = 'light' }) => {
	const rootCls = clsx(styles['c-icon'], { [styles['c-icon--solid']]: type === 'solid' });
	const hasIcon =
		type === 'light' ? ICON_LIGHT.includes(name) : ICON_SOLID.includes(name as IconSolidNames);
	return hasIcon ? <span className={rootCls}>{name}</span> : null;
};

export default Icon;
