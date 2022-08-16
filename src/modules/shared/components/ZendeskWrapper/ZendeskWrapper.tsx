import { get } from 'lodash-es';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Zendesk, { IZendeskProps } from 'react-zendesk';

import { selectShowZendesk } from '@shared/store/ui';

const { publicRuntimeConfig } = getConfig();

const ZendeskWrapper: FC<Partial<IZendeskProps>> = (settings) => {
	const router = useRouter();
	const showZendesk = useSelector(selectShowZendesk);

	const [footerHeight, setFooterHeight] = useState<number>(88);
	const [widget, setWidget] = useState<HTMLIFrameElement | null>(null);

	const zendeskMarginBottom = 22;
	const zendeskMarginRight = 31;

	useEffect(() => {
		if (showZendesk) {
			document.body.classList.remove('hide-zendesk-widget');
		} else {
			document.body.classList.add('hide-zendesk-widget');
		}
	}, [showZendesk]);

	const updateFooterHeight = useCallback(() => {
		setFooterHeight(
			get(
				document.querySelector('[class*="Footer_c-footer"]'),
				'clientHeight',
				0 // 0 when no footer is found
			)
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
			widget.style.marginRight = zendeskMarginRight + 'px';

			if (scrollHeight - screenHeight - scrollTop < footerHeight + zendeskMarginBottom) {
				widget.style.marginBottom = `${
					footerHeight + zendeskMarginBottom - (scrollHeight - screenHeight - scrollTop)
				}px`;
			} else {
				widget.style.marginBottom = zendeskMarginBottom + 'px';
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
		<Zendesk
			{...settings}
			zendeskKey={publicRuntimeConfig.ZENDESK_KEY}
			onLoaded={() => {
				initListeners();
				settings?.onLoaded?.();
			}}
		/>
	);
};

export default ZendeskWrapper;
