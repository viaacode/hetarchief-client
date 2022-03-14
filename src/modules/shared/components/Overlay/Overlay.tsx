import clsx from 'clsx';
import { FC } from 'react';

import { useScrollbarWidth } from '@shared/hooks/use-scrollbar-width';

import styles from './Overlay.module.scss';
import { OverlayProps } from './Overlay.types';

const Overlay: FC<OverlayProps> = ({
	className,
	style,
	type = 'dark',
	visible = false,
	animate,
	onClick = () => null,
	excludeScrollbar = true,
}) => {
	const scrollbarWidth = useScrollbarWidth(visible);

	return (
		<div
			className={clsx(
				className,
				styles['c-overlay'],
				styles[`c-overlay--${type}`],
				visible && styles['c-overlay--visible'],
				animate && styles[`c-overlay--${animate}`]
			)}
			style={{
				...style,
				width: excludeScrollbar ? `calc(100vw - ${scrollbarWidth}px)` : 'auto',
			}}
			onClick={onClick}
		/>
	);
};

export default Overlay;
