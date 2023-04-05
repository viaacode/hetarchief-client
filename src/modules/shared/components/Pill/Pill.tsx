import { Tooltip, TooltipContent, TooltipTrigger } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, ReactElement } from 'react';

import { Icon } from '..';

import styles from './Pill.module.scss';
import { PillProps } from './Pill.types';

const Pill: FC<PillProps> = ({ className, icon, label, isExpanded }: PillProps): ReactElement => {
	const rootCls = clsx(className, styles['c-pill'], {
		[styles['c-pill--expanded']]: isExpanded,
	});

	const renderTooltipPill = (): ReactElement => (
		<span className={rootCls}>
			<Tooltip position="top">
				<TooltipTrigger>
					<Icon name={icon} />
				</TooltipTrigger>
				<TooltipContent>{label}</TooltipContent>
			</Tooltip>
		</span>
	);

	const renderExpandedPill = (): ReactElement => (
		<div className={rootCls}>
			<Icon name={icon} />
			<span className={styles['c-pill__label']}>{label}</span>
		</div>
	);

	return isExpanded ? renderExpandedPill() : renderTooltipPill();
};

export default Pill;
