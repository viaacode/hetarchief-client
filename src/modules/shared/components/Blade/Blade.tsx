import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import FocusTrap from 'focus-trap-react';
import { FC } from 'react';

import { useBladeManagerContext } from '@shared/hooks/use-blade-manager-context';
import { useScrollLock } from '@shared/hooks/use-scroll-lock';

import { Icon } from '../Icon';
import { Overlay } from '../Overlay';

import styles from './Blade.module.scss';
import { BladeProps } from './Blade.types';

const Blade: FC<BladeProps> = ({
	className,
	children,
	isOpen,
	title,
	heading,
	footer,
	hideOverlay = false,
	hideCloseButton = false,
	showCloseButtonOnTop = false,
	onClose,
	layer,
}) => {
	const { isManaged, currentLayer, opacityStep, onCloseBlade } = useBladeManagerContext();
	useScrollLock(!isManaged && isOpen, 'Blade');

	const isLayered = isManaged && layer;
	const isBladeOpen = isLayered ? layer <= currentLayer : isOpen;

	const renderCloseButton = () => {
		return (
			<Button
				className={clsx(styles['c-blade__close-button'], {
					[styles['c-blade__close-button--absolute']]: showCloseButtonOnTop,
				})}
				icon={<Icon name="times" />}
				variants="text"
				onClick={() => {
					if (isLayered && onCloseBlade) {
						onCloseBlade(layer);
					} else if (onClose) {
						onClose();
					}
				}}
				disabled={!isOpen}
			/>
		);
	};

	const renderContent = (hide: boolean) => {
		return (
			<div
				role="dialog"
				aria-modal={isBladeOpen}
				aria-labelledby="bladeTitle"
				className={clsx(
					className,
					styles['c-blade'],
					isBladeOpen && styles['c-blade--visible'],
					layer === currentLayer && 'c-blade-active',
					isLayered && [styles['c-blade--managed']]
				)}
				// offset underlying blades
				style={
					isLayered && layer < currentLayer
						? {
								transform: `translateX(-${(currentLayer - layer) * 5.6}rem)`,
								visibility: hide ? 'hidden' : 'visible',
						  }
						: { visibility: hide ? 'hidden' : 'visible' }
				}
			>
				{!hideCloseButton && renderCloseButton()}
				<div className={styles['c-blade__title-wrapper']}>
					{heading ||
						(title && (
							<h3 id="bladeTitle" className={styles['c-blade__title']}>
								{title}
							</h3>
						))}
				</div>
				<div className={styles['c-blade__body-wrapper']}>{children}</div>
				<div className={styles['c-blade__footer-wrapper']}>{footer || <></>}</div>
			</div>
		);
	};

	return (
		<>
			{!hideOverlay && (
				<Overlay
					visible={isBladeOpen}
					onClick={isLayered && onCloseBlade ? () => onCloseBlade(layer) : onClose}
					animate="animate-default"
					className={clsx(className, styles['c-blade__overlay'], {
						[styles['c-blade__overlay--managed']]: isLayered && layer > 1,
					})}
					style={
						isLayered && layer > 1 && layer <= currentLayer
							? {
									transform: `translateX(-${(currentLayer - layer) * 5.6}rem)`,
									opacity: isBladeOpen
										? (0.4 - (layer - 2) * opacityStep).toFixed(2)
										: 0,
							  }
							: {}
					}
					type={isLayered && layer > 1 ? 'light' : 'dark'}
				/>
			)}
			<FocusTrap
				active={isBladeOpen && process.env.NODE_ENV !== 'test'}
				focusTrapOptions={{ clickOutsideDeactivates: true }}
			>
				{renderContent(false)}
			</FocusTrap>
		</>
	);
};

export default Blade;
