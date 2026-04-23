import { Tooltip, TooltipContent, TooltipTrigger } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import clsx from 'clsx';
import type { FC, ReactElement } from 'react';

import styles from './Pill.module.scss';
import type { PillProps } from './Pill.types';

const Pill: FC<PillProps> = ({
	className,
	icon,
	label,
	isExpanded,
	ariaLabel,
}: PillProps): ReactElement => {
	const rootCls = clsx(className, styles['c-pill'], {
		[styles['c-pill--expanded']]: isExpanded,
	});

	const renderTooltipPill = (): ReactElement => (
		<Tooltip position="right">
			<TooltipTrigger>
				<span className={rootCls} role="img" aria-label={ariaLabel}>
					<Icon name={icon} aria-hidden />
				</span>
			</TooltipTrigger>
			<TooltipContent>{label}</TooltipContent>
		</Tooltip>
	);

	const renderExpandedPill = (): ReactElement => (
		<div className={rootCls}>
			<Icon name={icon} aria-hidden />
			<span className={styles['c-pill__label']}>{label}</span>
		</div>
	);

	return isExpanded ? renderExpandedPill() : renderTooltipPill();
};

export default Pill;
