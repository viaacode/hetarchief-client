import { Button, keysEscape } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { useBladeManagerContext } from '@shared/hooks/use-blade-manager-context';
import { useScrollLock } from '@shared/hooks/use-scroll-lock';
import { useSize } from '@shared/hooks/use-size';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { selectHasOpenConfirmationModal } from '@shared/store/ui';
import { isMobileSize } from '@shared/utils/is-mobile';
import clsx from 'clsx';
import FocusTrap from 'focus-trap-react';
import { isUndefined } from 'lodash-es';
import Link from 'next/link';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Overlay } from '../Overlay';
import type { BladeFooterButton, BladeNewProps } from './Blade.types';
import styles from '././Blade_new.module.scss';

export const BladeNew: FC<BladeNewProps> = ({
	id,
	className,
	children,
	isOpen,
	showCloseButtonOnTop = false,
	onClose,
	wideBladeTitle,
	title,
	stickySubTitle,
	subTitle,
	footerButtons,
	stickyFooter = false,
	layer,
}) => {
	const [contentIsScrollable, setContentIsScrollable] = useState(false);
	const [contentHasBeenScrolled, setContentHasBeenScrolled] = useState(false);

	const { isManaged, currentLayer, opacityStep, onCloseBlade } = useBladeManagerContext();
	const hasOpenConfirmationModal = useSelector(selectHasOpenConfirmationModal);

	const contentRef = useRef<HTMLDivElement>(null);
	useSize(contentRef, (referenceStripContainer) => checkContentSize(referenceStripContainer));

	const checkContentSize = useCallback((referenceStripElement: HTMLElement) => {
		if (!referenceStripElement) {
			return;
		}
		const scrollHeight = referenceStripElement.scrollHeight;
		const height = referenceStripElement.clientHeight;

		setContentIsScrollable(scrollHeight > height);
	}, []);

	const onScrollContent = useCallback(() => {
		// We need to check the scroll position as well. Otherwise, if the content starts stretching, it will trigger as well
		if (
			isOpen &&
			contentIsScrollable &&
			!contentHasBeenScrolled &&
			(contentRef?.current?.scrollTop ?? 0) > 0
		) {
			setContentHasBeenScrolled(true);
		}
	}, [isOpen, contentIsScrollable, contentHasBeenScrolled]);

	useScrollLock(!isManaged && isOpen, 'Blade');

	const isLayered = isManaged && !!layer;
	const isBladeOpen = isLayered ? layer <= currentLayer : isOpen;

	// We need different functionalities for different viewport sizes
	const windowSize = useWindowSizeContext();
	const isMobile = isMobileSize(windowSize);

	// Hack to remove ios outline on the close button: https://meemoo.atlassian.net/browse/ARC-1025
	useEffect(() => {
		isOpen && (document.activeElement as HTMLElement)?.blur?.();
	}, [isOpen]);

	const handleClose = useCallback(() => {
		if (hasOpenConfirmationModal) {
			return;
		}

		if (isLayered && onCloseBlade) {
			onCloseBlade(layer, currentLayer);
		} else if (onClose) {
			onClose();
		}
		// Waiting for the animation to finish
		setTimeout(() => setContentHasBeenScrolled(false), 200);
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

	const renderHeader = () => {
		if (isMobile) {
			return (
				<div
					id={id}
					className={clsx(
						styles['c-blade__title'],
						contentHasBeenScrolled && [styles['c-blade__content-scrolled']]
					)}
				>
					{wideBladeTitle && (
						<div className={clsx(styles['c-blade__title--wide-blade'])}>{wideBladeTitle}</div>
					)}
					<div className={clsx(styles['c-blade__title--mobile-wrapper'])}>
						<h2 className={clsx(styles['c-blade__title--text'])}>{title}</h2>
						<Button
							className={clsx(styles['c-blade__close-button'], {
								[styles['c-blade__close-button--absolute']]: showCloseButtonOnTop,
							})}
							icon={<Icon name={IconNamesLight.Times} aria-hidden />}
							aria-label={tText('modules/shared/components/blade/blade___sluiten')}
							variants={['text', 'icon', 'xxs']}
							onClick={() => handleClose()}
							disabled={!isOpen}
						/>
					</div>
					<div className={clsx(styles['c-blade__title--sticky-subtitle'])}>{stickySubTitle}</div>
				</div>
			);
		}

		return (
			<>
				<div
					className={clsx(
						styles['c-blade__top-bar-container'],
						contentHasBeenScrolled && [styles['c-blade__content-scrolled']]
					)}
				>
					<Button
						className={clsx(styles['c-blade__close-button'], {
							[styles['c-blade__close-button--absolute']]: showCloseButtonOnTop,
						})}
						icon={<Icon name={IconNamesLight.Times} aria-hidden />}
						aria-label={tText('modules/shared/components/blade/blade___sluiten')}
						variants={['text', 'icon', 'xs']}
						onClick={() => handleClose()}
						disabled={!isOpen}
					/>
				</div>
				<div
					id={id}
					className={clsx(
						styles['c-blade__title'],
						contentHasBeenScrolled && [styles['c-blade__content-scrolled']]
					)}
				>
					{wideBladeTitle && (
						<div className={clsx(styles['c-blade__title--wide-blade'])}>{wideBladeTitle}</div>
					)}
					<h2 className={clsx(styles['c-blade__title--text'])}>{title}</h2>
					<div className={clsx(styles['c-blade__title--sticky-subtitle'])}>{stickySubTitle}</div>
					<div className={clsx(styles['c-blade__title--subtitle'])}>{subTitle}</div>
				</div>
			</>
		);
	};

	const renderFooterButton = (
		buttonConfig: (BladeFooterButton & { variants: string[] }) | undefined
	) => {
		if (!buttonConfig) {
			return null;
		}

		if (buttonConfig.href) {
			return (
				<Link passHref href={buttonConfig.href} aria-label={buttonConfig.label}>
					<Button
						label={buttonConfig.label}
						variants={buttonConfig.variants}
						onClick={() => buttonConfig.onClick?.()}
						disabled={buttonConfig.disabled}
					/>
				</Link>
			);
		}

		return (
			<Button
				label={buttonConfig.label}
				variants={buttonConfig.variants}
				onClick={() => buttonConfig.onClick?.()}
				disabled={buttonConfig.disabled}
			/>
		);
	};

	const renderFooter = () => {
		let firstButton: BladeFooterButton & { variants: string[] };
		let lastButton: (BladeFooterButton & { variants: string[] }) | undefined;

		const secondaryVariant = ['text'];
		const blackPrimaryVariant = ['dark'];

		if (footerButtons.length === 1) {
			firstButton = {
				...footerButtons[0],
				variants: footerButtons[0].enforceSecondary ? secondaryVariant : blackPrimaryVariant,
			};
		} else if (footerButtons.every((button) => button?.type === 'secondary')) {
			firstButton = {
				...footerButtons[0],
				variants: blackPrimaryVariant,
			};
			lastButton = {
				...(footerButtons[1] as BladeFooterButton),
				variants: secondaryVariant,
			};
		} else if (footerButtons.every((button) => button?.type === 'primary')) {
			firstButton = {
				...footerButtons[0],
				variants: ['primary'],
			};
			lastButton = {
				...(footerButtons[1] as BladeFooterButton),
				variants: ['secondary'],
			};
		} else {
			firstButton = {
				...footerButtons.find((button) => button?.type === 'primary'),
				variants: blackPrimaryVariant,
			} as BladeFooterButton & { variants: string[] };
			lastButton = {
				...footerButtons.find((button) => button?.type === 'secondary'),
				variants: secondaryVariant,
			} as BladeFooterButton & { variants: string[] };
		}

		return (
			<div
				className={clsx(
					styles['c-blade__footer'],
					stickyFooter && styles['c-blade__footer-sticky'],
					contentHasBeenScrolled && [styles['c-blade__content-scrolled']]
				)}
			>
				{renderFooterButton(firstButton)}
				{renderFooterButton(lastButton)}
			</div>
		);
	};

	const renderContent = () => {
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
					!!wideBladeTitle && [styles['c-blade--extra-wide']]
				)}
				// offset underlying blades
				style={
					isLayered && layer < currentLayer
						? {
								transform: `translateX(-${(currentLayer - layer) * 5.6}rem)`,
								visibility: 'visible',
							}
						: { visibility: 'visible' }
				}
			>
				{renderHeader()}
				<div
					ref={contentRef}
					className={styles['c-blade__body-wrapper']}
					onScroll={onScrollContent}
				>
					{isMobile && subTitle}
					{children}
					<div className={'u-flex-grow'} />
					{!stickyFooter && renderFooter()}
				</div>
				{stickyFooter && renderFooter()}
			</div>
		);
	};

	return (
		<>
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
			<FocusTrap
				active={isBladeOpen && process.env.NODE_ENV !== 'test'}
				focusTrapOptions={{ clickOutsideDeactivates: true }}
			>
				{renderContent()}
			</FocusTrap>
		</>
	);
};
