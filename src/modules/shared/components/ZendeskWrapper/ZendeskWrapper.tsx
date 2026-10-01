import getConfig from '@shared/config/public-runtime-config';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { selectShowZendesk } from '@shared/store/ui';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';
import { useRouter } from 'next/router';
import React, { type FC, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ZendeskImport, { type IZendeskProps } from 'react-zendesk';

// react-zendesk is a CommonJS module; under Next 16 / webpack ESM interop the default export
// can be wrapped in a `.default` property, so unwrap it defensively.
// biome-ignore lint/suspicious/noExplicitAny: CJS/ESM interop
const Zendesk = (ZendeskImport as any).default ?? ZendeskImport;

const { publicRuntimeConfig } = getConfig();

const ZendeskWrapper: FC<Partial<IZendeskProps>> = (settings) => {
	const router = useRouter();
	const showZendesk = useSelector(selectShowZendesk);
	const locale = useLocale();
	const [isLoaded, setIsLoaded] = useState<boolean>(false);

	const feedbackButtonHeight = 46;
	const zendeskMarginBottom = 22;
	const zendeskMarginRight = 31;

	const [footerHeight, setFooterHeight] = useState<number>(88);
	const [widget, setWidget] = useState<HTMLIFrameElement | null>(null);

	useEffect(() => {
		if (showZendesk) {
			document.body.classList.remove('hide-zendesk-widget');
		} else {
			document.body.classList.add('hide-zendesk-widget');
		}
	}, [showZendesk]);

	const updateFooterHeight = useCallback(() => {
		setFooterHeight(
			document.querySelector(moduleClassSelector('Footer', 'c-footer'))?.clientHeight || 0 // 0 when no footer is found
		);
	}, []);

	/**
	 * Change the bottom margin of the zendesk widget, so it doesn't overlap with the footer
	 */
	const updateMargin = useCallback(() => {
		if (widget) {
			const scrollHeight = document.body.scrollHeight;
			const screenHeight = window.innerHeight;
			const scrollTop = window.scrollY;

			widget.style.zIndex = '3'; // Ensure the zendesk widget doesn't show on top of blades
			widget.style.marginRight = `${zendeskMarginRight}px`;

			if (
				scrollHeight - screenHeight - scrollTop < footerHeight + zendeskMarginBottom &&
				footerHeight !== 0
			) {
				// Collided with footer
				// Show zendesk button on the edge of the footer
				widget.style.marginBottom = `${footerHeight - feedbackButtonHeight / 2 - (scrollHeight - screenHeight - scrollTop)}px`;
			} else {
				// Still scrolling, not yet collided with the footer
				// Or there is no footer on the page
				widget.style.marginBottom = `${zendeskMarginBottom}px`;
			}
		}
	}, [footerHeight, widget]);

	const getZendeskWidget = useCallback(() => {
		const zendeskWidget: HTMLIFrameElement | null =
			(document.querySelector('iframe#launcher') as HTMLIFrameElement) || null;

		if (!zendeskWidget) {
			setTimeout(getZendeskWidget, 100);
		} else {
			setWidget(zendeskWidget);
		}
	}, []);

	/**
	 * Zendesk uses the browser language by default, make it follow the website language instead
	 */
	useEffect(() => {
		if (isLoaded) {
			window.zE?.('webWidget', 'setLocale', locale);
		}
	}, [isLoaded, locale]);

	/**
	 * Make the launcher iframe exactly as wide as the button inside it.
	 * The button is a pill with text on desktop and a circle on mobile.
	 * The iframe is same-origin (created by the zendesk script), so we can measure its contents.
	 */
	useEffect(() => {
		if (!widget) {
			return;
		}
		let buttonObserver: ResizeObserver | null = null;
		let timeout: ReturnType<typeof setTimeout>;
		const observeButton = () => {
			const button = widget.contentDocument?.querySelector('button');
			if (!button) {
				timeout = setTimeout(observeButton, 100);
				return;
			}
			const fitWidth = () => {
				// Set on body, since zendesk overwrites the inline styles of the iframe
				document.body.style.setProperty(
					'--zendesk-launcher-width',
					`${Math.ceil(button.getBoundingClientRect().width)}px`
				);
			};
			buttonObserver = new ResizeObserver(fitWidth);
			buttonObserver.observe(button);
			fitWidth();
		};
		observeButton();
		return () => {
			clearTimeout(timeout);
			buttonObserver?.disconnect();
		};
	}, [widget]);

	const onResize = useCallback(() => {
		updateFooterHeight();
		updateMargin();
	}, [updateFooterHeight, updateMargin]);

	const initListeners = useCallback(() => {
		document.addEventListener('scroll', updateMargin);
		window.addEventListener('resize', onResize);

		const resizeObserver = new ResizeObserver(() => {
			updateFooterHeight();
			updateMargin();
		});
		resizeObserver.observe(document.body);

		updateFooterHeight();
		getZendeskWidget();
		updateMargin();

		return () => {
			resizeObserver.disconnect();

			document.removeEventListener('scroll', updateMargin);
			window.removeEventListener('resize', onResize);
		};
	}, [onResize, updateFooterHeight, getZendeskWidget, updateMargin]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: we need it this way
	useEffect(() => {
		setTimeout(() => {
			initListeners();
		}, 100);
	}, [initListeners, widget, router.asPath]);

	return (
		<NoServerSideRendering>
			<Zendesk
				{...settings}
				zendeskKey={publicRuntimeConfig.ZENDESK_KEY}
				defer={true}
				color={{ theme: '#00857d' }} // Ensure a contrast of 4.51:1 with white text
				onLoaded={() => {
					setIsLoaded(true);
					initListeners();
					settings?.onLoaded?.();
				}}
			/>
		</NoServerSideRendering>
	);
};

export default ZendeskWrapper;
