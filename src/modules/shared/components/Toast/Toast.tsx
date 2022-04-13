import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC } from 'react';

import { useHover } from '../../hooks/use-hover';

import styles from './Toast.module.scss';
import { ToastProps } from './Toast.types';

const Toast: FC<ToastProps> = ({
	className,
	title,
	description,
	buttonLabel,
	buttonLabelHover,
	maxLines = 1,
	visible = false,
	onClose,
}) => {
	const [hovering, hoverProps] = useHover();

	return (
		<div
			className={clsx(
				className,
				styles['c-toast'],
				visible ? styles['c-toast--visible'] : styles['c-toast--hidden']
			)}
			aria-hidden={!visible}
		>
			<div className={`u-text-ellipsis--${maxLines}`}>
				<p data-testid="toast-title" className={styles['c-toast__title']}>
					{title}
				</p>
			</div>
			<div className={`u-text-ellipsis--${maxLines}`}>
				<p data-testid="toast-description" className={styles['c-toast__description']}>
					{description}
				</p>
			</div>
			<div {...hoverProps} className={styles['c-toast__button-wrapper']}>
				<Button
					className={styles['c-toast__button']}
					label={buttonLabelHover && hovering ? buttonLabelHover : buttonLabel}
					variants="white"
					onClick={onClose}
				/>
			</div>
		</div>
	);
};

export default Toast;
