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

	const getWidth = (): { width?: string } => {
		if (excludeScrollbar && scrollbarWidth > 0) {
			return {
				width: `calc(100vw - ${scrollbarWidth}px)`,
			};
		}

		return { width: undefined };
	};

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
				...getWidth(),
			}}
			onClick={onClick}
		/>
	);
};

export default Overlay;
