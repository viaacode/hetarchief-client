import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import warningStyles from '@shared/components/RedFormWarning/RedFormWarning.module.scss';
import { tHtml, tText } from '@shared/helpers/translate';
import { useSize } from '@shared/hooks/use-size';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { isMobileSize } from '@shared/utils/is-mobile';
import clsx from 'clsx';
import Link from 'next/link';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import styles from '././Blade.module.scss';
import type { BladeContentProps, BladeFooterButton } from './Blade.types';

export const BladeContent: FC<BladeContentProps> = ({
	id,
	children,
	closable = true,
	onClose,
	wideBladeTitle,
	title,
	stickySubtitle,
	subtitle,
	isBladeInvalid = false,
	footerButtons,
	stickyFooter = true,
}) => {
	const [contentIsScrollable, setContentIsScrollable] = useState(false);
	const [contentHasBeenScrolled, setContentHasBeenScrolled] = useState(false);

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
			contentIsScrollable &&
			!contentHasBeenScrolled &&
			(contentRef?.current?.scrollTop ?? 0) > 0
		) {
			setContentHasBeenScrolled(true);
		}
	}, [contentIsScrollable, contentHasBeenScrolled]);

	// We need different functionalities for different viewport sizes
	const windowSize = useWindowSizeContext();
	const isMobile = isMobileSize(windowSize);

	// Hack to remove ios outline on the close button: https://meemoo.atlassian.net/browse/ARC-1025
	useEffect(() => {
		(document.activeElement as HTMLElement)?.blur?.();
	}, []);

	// When the blade is set to invalid we search the children for the first error
	// Expecting that every error is using <RedFormWarning ... /> so we can find it
	useEffect(() => {
		if (isBladeInvalid) {
			const warningCls = warningStyles['c-red-form-warning'];
			// Search the first <RedFormWarning ... />
			const firstError = contentRef.current?.querySelector<HTMLDivElement>(`.${warningCls}`);

			// When it is closable this will to all likelihood be rendered inside a blade
			if (closable) {
				// Scroll the error into view
				firstError?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				});
			} else {
				// Not rendered inside a blade so we are scrolling differently to avoid the entire screen to scroll
				contentRef.current?.scrollTo({ behavior: 'smooth', top: firstError?.offsetTop });
			}
		}
	}, [isBladeInvalid, closable]);

	const handleClose = useCallback(() => {
		if (closable) {
			onClose?.();
		}
	}, [closable, onClose]);

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
					<div className={clsx(styles['c-blade__title--mobile-wrapper'])}>
						<h2 className={clsx(styles['c-blade__title--text'])}>{title}</h2>
						{closable && (
							<Button
								className={clsx(styles['c-blade__close-button'])}
								icon={<Icon name={IconNamesLight.Times} aria-hidden />}
								aria-label={tText('modules/shared/components/blade/blade___sluiten')}
								variants={['text', 'icon', 'xxs']}
								onClick={() => handleClose()}
							/>
						)}
					</div>
					{stickySubtitle && (
						<div className={clsx(styles['c-blade__title--sticky-subtitle'])}>{stickySubtitle}</div>
					)}
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
					{closable && (
						<Button
							className={clsx(styles['c-blade__close-button'])}
							icon={<Icon name={IconNamesLight.Times} aria-hidden />}
							aria-label={tText('modules/shared/components/blade/blade___sluiten')}
							variants={['text', 'icon', 'xs']}
							onClick={() => handleClose()}
						/>
					)}
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
					{stickySubtitle && (
						<div className={clsx(styles['c-blade__title--sticky-subtitle'])}>{stickySubtitle}</div>
					)}
					{subtitle && <div className={clsx(styles['c-blade__title--subtitle'])}>{subtitle}</div>}
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

		const label = isMobile ? buttonConfig.mobileLabel : buttonConfig.label;

		const renderButton = () => {
			return (
				<Button
					label={label}
					title={buttonConfig.title || undefined}
					aria-label={buttonConfig.ariaLabel || undefined}
					variants={buttonConfig.variants}
					onClick={() => buttonConfig.onClick?.()}
					disabled={buttonConfig.disabled}
					iconStart={buttonConfig.icon && <Icon name={buttonConfig.icon} />}
				/>
			);
		};

		if (buttonConfig.href) {
			return (
				<Link passHref href={buttonConfig.href} aria-label={buttonConfig.ariaLabel || label}>
					{renderButton()}
				</Link>
			);
		}
		return renderButton();
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
				{isBladeInvalid && (
					<RedFormWarning
						className={clsx(styles['c-blade__footer--validation'])}
						error={tHtml(
							'Er staan fouten in dit formulier. Corrigeer deze en probeer het opnieuw.'
						)}
					/>
				)}
				<div
					className={clsx(
						styles['c-blade__footer-buttons'],
						wideBladeTitle && styles['c-blade__footer-buttons-extra-wide']
					)}
				>
					{renderFooterButton(firstButton)}
					{renderFooterButton(lastButton)}
				</div>
			</div>
		);
	};

	const renderContent = () => (
		<>
			{renderHeader()}
			<div ref={contentRef} className={styles['c-blade__body-wrapper']} onScroll={onScrollContent}>
				<div className={clsx(styles['c-blade__body-wrapper--content'])}>
					{isMobile && subtitle && (
						<div className={clsx(styles['c-blade__body-wrapper--subtitle'])}>{subtitle}</div>
					)}
					{children}
				</div>
				<div className={'u-flex-grow'} />
				{!stickyFooter && renderFooter()}
			</div>
			{stickyFooter && renderFooter()}
		</>
	);

	if (closable) {
		return renderContent();
	}

	return <div className={clsx(styles['c-blade__content-standalone'])}>{renderContent()}</div>;
};
