import clsx from 'clsx';
import { FC } from 'react';

import styles from './Overlay.module.scss';
import { OverlayProps } from './Overlay.types';

const Overlay: FC<OverlayProps> = ({ type = 'dark', visible = false, onClick = () => null }) => {
	return (
		<div
			className={clsx(
				styles['c-overlay'],
				styles[`c-overlay--${type}`],
				visible && styles['c-overlay--visible']
			)}
			onClick={onClick}
		/>
	);
};

export default Overlay;
