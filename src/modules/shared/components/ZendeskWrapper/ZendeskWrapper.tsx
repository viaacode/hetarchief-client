import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { type FC, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Zendesk, { type IZendeskProps } from 'react-zendesk';

import { moduleClassSelector } from '@shared/helpers/module-class-locator';
import { selectShowZendesk } from '@shared/store/ui';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';

const { publicRuntimeConfig } = getConfig();

const ZendeskWrapper: FC<Partial<IZendeskProps>> = (settings) => {
	const router = useRouter();
	const showZendesk = useSelector(selectShowZendesk);

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
			document.querySelector(moduleClassSelector('c-footer'))?.clientHeight || 0 // 0 when no footer is found
		);
	}, [setFooterHeight]);

	/**
	 * Change the bottom margin of the zendesk widget, so it doesn't overlap with the footer
	 */
	const updateMargin = useCallback(() => {
		if (widget) {
			const scrollHeight = document.body.scrollHeight;
			const screenHeight = window.innerHeight;
			const scrollTop = window.scrollY;

			widget.style.zIndex = '3'; // Ensure the zendesk widget doesn't show on top of blades
			widget.style.width = 'auto';
			widget.style.marginRight = `${zendeskMarginRight}px`;

			if (
				scrollHeight - screenHeight - scrollTop < footerHeight + zendeskMarginBottom &&
				footerHeight !== 0
			) {
				// Collided with footer
				// Show zendesk button on the edge of the footer
				widget.style.marginBottom = `${
					footerHeight -
					feedbackButtonHeight / 2 -
					(scrollHeight - screenHeight - scrollTop)
				}px`;
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
	}, [setWidget]);

	const onResize = useCallback(() => {
		updateFooterHeight();
		updateMargin();
	}, [updateFooterHeight, updateMargin]);

	const initListeners = useCallback(() => {
		document.addEventListener('scroll', updateMargin);
		window.addEventListener('resize', onResize);

		const resizeObserver = new ResizeObserver(updateMargin);
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
					initListeners();
					settings?.onLoaded?.();
				}}
			/>
		</NoServerSideRendering>
	);
};

export default ZendeskWrapper;
