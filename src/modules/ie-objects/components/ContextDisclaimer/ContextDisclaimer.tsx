import type { ContextDisclaimerProps } from '@ie-objects/components/ContextDisclaimer/ContextDisclaimer.types';
import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml, tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import React, { type FC, useState } from 'react';

import styles from './ContextDisclaimer.module.scss';

/**
 * Tells the user that the content itself was made within a context (historical, societal, ...)
 * and must be viewed within that context. Shown on top of the player of a publicly available
 * audio or video object.
 * https://meemoo.atlassian.net/browse/ARC-3824
 */
export const ContextDisclaimer: FC<ContextDisclaimerProps> = ({ className }) => {
	const [isActive, setIsActive] = useState(true);
	const showLabel = tText(
		'modules/ie-objects/components/context-disclaimer/context-disclaimer___toon-de-context-van-dit-fragment'
	);

	if (!isActive) {
		return (
			<Button
				className={clsx(
					styles['c-context-disclaimer'],
					styles['c-context-disclaimer--inactive'],
					className
				)}
				icon={<Icon name={IconNamesLight.StorageBox} />}
				ariaLabel={showLabel}
				tooltipText={showLabel}
				tooltipPosition="right"
				onClick={() => setIsActive(true)}
			/>
		);
	}

	return (
		<div
			className={clsx(
				styles['c-context-disclaimer'],
				styles['c-context-disclaimer--active'],
				className
			)}
		>
			<Icon className={styles['c-context-disclaimer__icon']} name={IconNamesLight.StorageBox} />
			<div className={styles['c-context-disclaimer__label']}>
				{tHtml(
					'modules/ie-objects/components/context-disclaimer/context-disclaimer___de-context-van-dit-archief-is-belangrijk-bij-het-begrip-van-deze-video-meer-weten'
				)}
			</div>
			<Button
				className={styles['c-context-disclaimer__close-button']}
				icon={<Icon name={IconNamesLight.Times} />}
				variants={['text']}
				ariaLabel={tText(
					'modules/ie-objects/components/context-disclaimer/context-disclaimer___verberg-de-context-van-dit-fragment'
				)}
				onClick={() => setIsActive(false)}
			/>
		</div>
	);
};
