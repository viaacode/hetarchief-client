import clsx from 'clsx';
import { FC } from 'react';

import styles from './Overlay.module.scss';
import { OverlayProps } from './Overlay.types';

const Overlay: FC<OverlayProps> = ({
	className,
	type = 'dark',
	visible = false,
	animate,
	onClick = () => null,
}) => {
	return (
		<div
			className={clsx(
				className,
				styles['c-overlay'],
				styles[`c-overlay--${type}`],
				visible && styles['c-overlay--visible'],
				animate && styles[`c-overlay--${animate}`]
			)}
			onClick={onClick}
		/>
	);
};

export default Overlay;
