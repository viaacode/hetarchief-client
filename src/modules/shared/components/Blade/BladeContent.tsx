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
import { type FC, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import styles from '././Blade.module.scss';
import { type BladeContentProps, type BladeFooterButton, BladeSizeType } from './Blade.types';

export const BladeContent: FC<BladeContentProps> = ({
	id,
	children,
	closable = true,
	onClose,
	size = BladeSizeType.THIN,
	title,
	stickySubtitle,
	subtitle,
	showHeaderBackgroundByDefault = false,
	showTitleSmaller = false,
	isBladeInvalid = false,
	footerButtons,
	ignoreFooterButtons,
	customFooter,
	stickyFooter = true,
	removePaddingForCustomFooter,
}) => {
	const [contentIsScrollable, setContentIsScrollable] = useState(false);
	const [contentHasBeenScrolled, setContentHasBeenScrolled] = useState(
		showHeaderBackgroundByDefault
	);

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
		if (isMobile || size === BladeSizeType.WIDE) {
			return (
				<div
					id={id}
					className={clsx(
						'c-blade__title',
						styles['c-blade__title'],
						showTitleSmaller && styles['c-blade__title-small'],
						contentHasBeenScrolled && [styles['c-blade__content-scrolled']],
						size === BladeSizeType.WIDE && styles['c-blade__title--size-wide']
					)}
				>
					<div className={clsx(styles['c-blade__title--mobile-wrapper'])}>
						<h2
							className={clsx(
								styles['c-blade__title--text'],
								showTitleSmaller && styles['c-blade__title--text-small']
							)}
						>
							{title}
						</h2>
						{closable && (
							<Button
								className={clsx(styles['c-blade__close-button'])}
								icon={<Icon name={IconNamesLight.Times} aria-hidden />}
								ariaLabel={tText('modules/shared/components/blade/blade___sluiten')}
								variants={['text', 'icon', 'xxs']}
								onClick={() => handleClose()}
							/>
						)}
					</div>
					{stickySubtitle && (
						<div className={clsx(styles['c-blade__title--sticky-subtitle'])}>{stickySubtitle}</div>
					)}
					{!isMobile && subtitle && (
						<div className={clsx(styles['c-blade__title--subtitle'])}>{subtitle}</div>
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
							ariaLabel={tText('modules/shared/components/blade/blade___sluiten')}
							variants={['text', 'icon', 'xs']}
							onClick={() => handleClose()}
						/>
					)}
				</div>
				<div
					id={id}
					className={clsx(
						'c-blade__title',
						styles['c-blade__title'],
						showTitleSmaller && styles['c-blade__title-small'],
						contentHasBeenScrolled && [styles['c-blade__content-scrolled']]
					)}
				>
					<h2
						className={clsx(
							styles['c-blade__title--text'],
							showTitleSmaller && styles['c-blade__title--text-small']
						)}
					>
						{title}
					</h2>
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

		const renderButton = (isWrappedInLink: boolean) => {
			return (
				<Button
					label={label}
					title={buttonConfig.title || undefined}
					ariaLabel={buttonConfig.ariaLabel || undefined}
					variants={buttonConfig.variants}
					onClick={() => buttonConfig.onClick?.()}
					disabled={buttonConfig.disabled}
					iconStart={buttonConfig.icon && <Icon name={buttonConfig.icon} aria-hidden />}
					tabIndex={isWrappedInLink ? -1 : undefined}
				/>
			);
		};

		if (buttonConfig.href) {
			return (
				<Link
					passHref
					href={buttonConfig.href}
					target={buttonConfig.externalLink ? '_blank' : '_self'}
					aria-label={buttonConfig.ariaLabel || label}
				>
					{renderButton(true)}
				</Link>
			);
		}
		return renderButton(false);
	};

	const renderFooterWrapper = (children: ReactNode) => {
		return (
			<div
				className={clsx(
					styles['c-blade__footer'],
					stickyFooter && styles['c-blade__footer-sticky'],
					contentHasBeenScrolled && [styles['c-blade__content-scrolled']],
					ignoreFooterButtons &&
						customFooter &&
						removePaddingForCustomFooter &&
						styles['c-blade__footer__no-padding']
				)}
			>
				{isBladeInvalid && (
					<RedFormWarning
						className={clsx(styles['c-blade__footer--validation'])}
						error={tHtml(
							'modules/shared/components/blade/blade-content___er-staan-fouten-in-dit-formulier-corrigeer-deze-en-probeer-het-opnieuw'
						)}
					/>
				)}
				<div
					className={clsx(
						styles['c-blade__footer-buttons'],
						size === BladeSizeType.WIDE && styles['c-blade__footer-buttons--size-wide']
					)}
				>
					{children}
				</div>
			</div>
		);
	};

	const renderFooter = () => {
		let firstButton: BladeFooterButton & { variants: string[] };
		let lastButton: (BladeFooterButton & { variants: string[] }) | undefined;

		const secondaryVariant = ['text'];
		const blackPrimaryVariant = ['dark'];

		// No footer buttons passed so checking if there is logic for the custom footer
		if (!footerButtons) {
			if (ignoreFooterButtons) {
				// Okay, the developer want to explicitly ignore the default logic so rendering the custom footer
				return customFooter && renderFooterWrapper(customFooter);
			}
			throw new Error(
				`Are you sure you want to ignore the footer buttons????? You really should NOT do this unless in rare cases by ignoreFooterButtons`
			);
		} else if (customFooter || ignoreFooterButtons) {
			throw new Error(
				`Avoid doing this. Either use the footer buttons or a custom footer. So clean up this mess.`
			);
		}

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

		let renderPrimaryFirst: boolean;

		// Wide blade always have their buttons on 1 line. The primary should be on the right
		if (size === BladeSizeType.WIDE) {
			renderPrimaryFirst = false;
		} else if (isMobile) {
			// Normal blades only have their buttons on 1 line on mobile. So only then should the primary be on the right
			renderPrimaryFirst = false;
		} else {
			// Otherwise the primary should be on top
			renderPrimaryFirst = true;
		}

		return renderFooterWrapper(
			renderPrimaryFirst ? (
				<>
					{renderFooterButton(firstButton)}
					{renderFooterButton(lastButton)}
				</>
			) : (
				<>
					{renderFooterButton(lastButton)}
					{renderFooterButton(firstButton)}
				</>
			)
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
