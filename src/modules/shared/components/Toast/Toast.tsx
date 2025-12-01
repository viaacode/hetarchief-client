import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import clsx from 'clsx';
import type { FC } from 'react';

import { useHover } from '../../hooks/use-hover';

import styles from './Toast.module.scss';
import type { ToastProps } from './Toast.types';

const Toast: FC<ToastProps> = ({
	className,
	title,
	description,
	buttonLabel,
	buttonLabelHover,
	maxLines = 1,
	visible = false,
	onClose,
	actionLabel,
	onAction,
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
					variants={actionLabel ? ['text', 'white', 'xs'] : 'white'}
					icon={
						actionLabel ? (
							<Icon name={IconNamesLight.Times} className="u-font-size-18" aria-hidden />
						) : undefined
					}
					onClick={onClose}
				/>
			</div>

			{actionLabel && onAction && (
				<Button
					className={styles['c-toast__action-button']}
					label={actionLabel}
					variants="white"
					onClick={onAction}
				/>
			)}
		</div>
	);
};

export default Toast;
