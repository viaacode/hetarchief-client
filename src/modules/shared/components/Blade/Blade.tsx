import { Button, keysEscape } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { useBladeManagerContext } from '@shared/hooks/use-blade-manager-context';
import { useScrollLock } from '@shared/hooks/use-scroll-lock';
import { selectHasOpenConfirmationModal } from '@shared/store/ui';
import clsx from 'clsx';
import FocusTrap from 'focus-trap-react';
import { isUndefined } from 'lodash-es';
import { type FC, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Overlay } from '../Overlay';

import styles from './Blade.module.scss';
import type { BladeProps } from './Blade.types';

export const Blade: FC<BladeProps> = ({
	className,
	children,
	isOpen,
	footer,
	hideOverlay = false,
	hideCloseButton = false,
	showCloseButtonOnTop = false,
	showBackButton = false,
	onClose,
	layer,
	renderTitle,
	id,
	extraWide,
	headerBackground = 'white',
	stickyFooter = false,
}) => {
	const { isManaged, currentLayer, opacityStep, onCloseBlade } = useBladeManagerContext();
	const hasOpenConfirmationModal = useSelector(selectHasOpenConfirmationModal);

	useScrollLock(!isManaged && isOpen, 'Blade');

	const isLayered = isManaged && !!layer;
	const isBladeOpen = isLayered ? layer <= currentLayer : isOpen;

	// Hack to remove ios outline on the close button: https://meemoo.atlassian.net/browse/ARC-1025
	useEffect(() => {
		isOpen && (document.activeElement as HTMLElement)?.blur?.();
	}, [isOpen]);

	const handleClose = useCallback(() => {
		console.log('handleClose', hasOpenConfirmationModal);

		if (hasOpenConfirmationModal) {
			return;
		}

		if (isLayered && onCloseBlade) {
			console.log('onCloseBlade');
			onCloseBlade(layer, currentLayer);
		} else if (onClose) {
			console.log('onClose');
			onClose();
		}
	}, [hasOpenConfirmationModal, isLayered, layer, currentLayer, onClose, onCloseBlade]);

	const escFunction = useCallback(
		(event: KeyboardEvent) => {
			// Only allow the esc functionality to be triggered when the blade is open
			if (isOpen && keysEscape.includes(event.key)) {
				if (isLayered) {
					// Stop propagation in layered blades so it is only triggered once
					event.stopImmediatePropagation();
				}
				handleClose();
			}
		},
		[isOpen, isLayered, handleClose]
	);

	useEffect(() => {
		document.addEventListener('keydown', escFunction, false);

		return () => {
			document.removeEventListener('keydown', escFunction, false);
		};
	}, [escFunction]);

	const renderTopBar = () => {
		return (
			<div
				className={clsx(
					styles['c-blade__top-bar-container'],
					headerBackground === 'platinum' ? 'u-bg-platinum' : 'u-bg-white'
				)}
			>
				{showBackButton && (
					/* biome-ignore lint/a11y/useKeyWithClickEvents: onKeyUp is added to the inner button */
					/** biome-ignore lint/a11y/noStaticElementInteractions: Container should also be clickable */
					<div
						className={styles['c-blade__back-container']}
						onClick={() => {
							handleClose();
						}}
					>
						<Button
							variants="text"
							icon={
								<Icon
									name={IconNamesLight.ArrowLeft}
									onKeyUp={(evt) => {
										if (evt.key === 'Enter') {
											handleClose();
										}
									}}
								/>
							}
						/>
						<span>{tText('modules/shared/components/blade/blade___vorige-stap')}</span>
					</div>
				)}
				<Button
					className={clsx(styles['c-blade__close-button'], {
						[styles['c-blade__close-button--absolute']]: showCloseButtonOnTop,
					})}
					icon={<Icon name={IconNamesLight.Times} aria-hidden />}
					aria-label={tText('modules/shared/components/blade/blade___sluiten')}
					variants="text"
					onClick={() => handleClose()}
					disabled={!isOpen}
				/>
			</div>
		);
	};

	const renderContent = (hide: boolean) => {
		return (
			<div
				role="dialog"
				aria-modal
				aria-labelledby={id}
				className={clsx(
					className,
					styles['c-blade'],
					isBladeOpen && styles['c-blade--visible'],
					isBladeOpen &&
						(layer === currentLayer || (currentLayer === 0 && isUndefined(layer))) &&
						'c-blade--active',
					isLayered && [styles['c-blade--managed']],
					extraWide && [styles['c-blade--extra-wide']]
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
				{!hideCloseButton && renderTopBar()}

				<div className={styles['c-blade__body-wrapper']}>
					{renderTitle?.({ id, className: styles['c-blade__title'] })}
					{children}
					<div className={styles['c-blade__flex-grow']} />
					{!stickyFooter && footer && <div className={styles['c-blade__footer']}>{footer}</div>}
				</div>
				{stickyFooter && footer && (
					<div className={clsx(styles['c-blade__footer'], styles['c-blade__footer-sticky'])}>
						{footer}
					</div>
				)}
			</div>
		);
	};

	return (
		<>
			{!hideOverlay && (
				<Overlay
					visible={isBladeOpen}
					onClick={() => handleClose()}
					animate="animate-default"
					className={clsx(className, styles['c-blade__overlay'], {
						[styles['c-blade__overlay--managed']]: isLayered && layer > 1,
					})}
					style={
						isLayered && layer > 1 && layer <= currentLayer
							? {
									transform: `translateX(-${(currentLayer - layer) * 5.6}rem)`,
									opacity: isBladeOpen ? (0.4 - (layer - 2) * opacityStep).toFixed(2) : 0,
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
