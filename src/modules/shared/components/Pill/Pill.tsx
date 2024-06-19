import { Tooltip, TooltipContent, TooltipTrigger } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, type ReactElement } from 'react';

import { Icon } from '@shared/components/Icon';

import styles from './Pill.module.scss';
import { type PillProps } from './Pill.types';

const Pill: FC<PillProps> = ({ className, icon, label, isExpanded }: PillProps): ReactElement => {
	const rootCls = clsx(className, styles['c-pill'], {
		[styles['c-pill--expanded']]: isExpanded,
	});

	const renderTooltipPill = (): ReactElement => (
		<Tooltip position="right">
			<TooltipTrigger>
				<span className={rootCls}>
					<Icon name={icon} />
				</span>
			</TooltipTrigger>
			<TooltipContent>{label}</TooltipContent>
		</Tooltip>
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
