import clsx from 'clsx';
import { FC } from 'react';

import styles from './Icon.module.scss';
import { IconProps } from './Icon.types';

const Icon: FC<IconProps> = ({ className, name, ...rest }) => {
	const [iconName, type] = name.split('--');

	const rootCls = clsx(className, styles['c-icon'], {
		[styles['c-icon--solid']]: type === 'solid',
	});

	// const hasIcon =
	// 	type === 'light'
	// 		? ICON_LIGHT.includes(name as IconNamesLight)
	// 		: ICON_SOLID.includes(name as IconNamesLight);

	// return true ? (
	// 	<span className={rootCls} {...rest}>
	// 		{name}
	// 	</span>
	// ) : null;

	return (
		<span className={rootCls} {...rest}>
			{iconName}
		</span>
	);
};

export default Icon;
