import { Tooltip, TooltipContent, TooltipTrigger } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { type FC } from 'react';

import type { ConfidenceIndicatorProps } from '@ie-objects/components/ConfidenceIndicator/ConfidenceIndicator.types';
import { tText } from '@shared/helpers/translate';

import styles from './ConfidenceIndicator.module.scss';

export const ConfidenceIndicator: FC<ConfidenceIndicatorProps> = ({ className, confidence }) => {
	confidence = 0.8;
	return (
		<Tooltip position="left">
			<TooltipTrigger>
				<div className={clsx(styles['c-confidence-indicator'], className)}>
					<div className={styles['c-confidence-indicator__bars-container']}>
						<span className={confidence > 0.75 ? 'active' : undefined} />
						<span className={confidence > 0.5 ? 'active' : undefined} />
						<span className={confidence > 0.25 ? 'active' : undefined} />
					</div>

					<span>{Math.ceil(confidence * 100)}%</span>
				</div>
			</TooltipTrigger>
			<TooltipContent>
				{tText(
					'modules/ie-objects/components/confidence-indicator/confidence-indicator___we-zijn-confidence-zeker-dat-deze-naam-voorkomt-in-deze-krant',
					{
						confidence: Math.ceil(confidence * 100),
					}
				)}
			</TooltipContent>
		</Tooltip>
	);
};

export default ConfidenceIndicator;
