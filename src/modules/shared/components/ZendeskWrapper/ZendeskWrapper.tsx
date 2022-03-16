import { get } from 'lodash-es';
import getConfig from 'next/config';
import React, { FunctionComponent } from 'react';
import Zendesk from 'react-zendesk';

const { publicRuntimeConfig } = getConfig();

const ZendeskWrapper: FunctionComponent = () => {
	/**
	 * Change the bottom margin of the zendesk widget so it doesn't overlap with the footer
	 */
	const onLoaded = () => {
		let widget: HTMLIFrameElement | null;
		let footerHeight = 88;
		const zendeskMarginBottom = 22;
		const zendeskMarginRight = 31;
		const updateFooterHeight = () => {
			footerHeight = get(
				document.querySelector('.c-global-footer'),
				'clientHeight',
				footerHeight
			);
		};
		const updateMargin = () => {
			if (widget) {
				const scrollHeight = document.body.scrollHeight;
				const screenHeight = document.body.clientHeight;
				const scrollTop = document.body.scrollTop;
				widget.style.marginRight = zendeskMarginRight + 'px';
				if (scrollHeight - screenHeight - scrollTop < footerHeight + zendeskMarginBottom) {
					widget.style.marginBottom = `${
						footerHeight +
						zendeskMarginBottom -
						(scrollHeight - screenHeight - scrollTop)
					}px`;
				} else {
					widget.style.marginBottom = zendeskMarginBottom + 'px';
				}
			}
		};
		document.body.addEventListener('scroll', updateMargin);
		window.addEventListener('resize', () => {
			updateFooterHeight();
			updateMargin();
		});

		const getZendeskWidget = () => {
			widget = document.querySelector('iframe#launcher');
			if (!widget) {
				setTimeout(getZendeskWidget, 100);
			} else {
				updateFooterHeight();
				updateMargin();
			}
		};
		getZendeskWidget();
	};

	return <Zendesk zendeskKey={publicRuntimeConfig.ZENDESK_KEY} onLoaded={onLoaded} />;
};

export default ZendeskWrapper;
