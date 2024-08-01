import { Tooltip, TooltipContent, TooltipTrigger } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { type ConfidenceIndicatorProps } from '@ie-objects/components/ConfidenceIndicator/ConfidenceIndicator.types';
import { tText } from '@shared/helpers/translate';

import styles from './ConfidenceIndicator.module.scss';

export const ConfidenceIndicator: FC<ConfidenceIndicatorProps> = ({ className, confidence }) => {
	return (
		<Tooltip position="left">
			<TooltipTrigger>
				<div className={clsx(styles['c-confidence-indicator'], className)}>
					<div className={styles['c-confidence-indicator__bars-container']}>
						<span className={confidence > 75 ? 'active' : undefined} />
						<span className={confidence > 50 ? 'active' : undefined} />
						<span className={confidence > 25 ? 'active' : undefined} />
					</div>

					<span>{confidence}%</span>
				</div>
			</TooltipTrigger>
			<TooltipContent>
				{tText(
					'modules/ie-objects/components/confidence-indicator/confidence-indicator___we-zijn-confidence-zeker-dat-deze-naam-voorkomt-in-deze-krant',
					{
						confidence,
					}
				)}
			</TooltipContent>
		</Tooltip>
	);
};

export default ConfidenceIndicator;
