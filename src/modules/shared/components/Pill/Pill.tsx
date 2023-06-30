import { Tooltip, TooltipContent, TooltipTrigger } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, ReactElement } from 'react';

import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { Breakpoints } from '@shared/types';

import { Icon } from '..';

import styles from './Pill.module.scss';
import { PillProps } from './Pill.types';

const Pill: FC<PillProps> = ({ className, icon, label, isExpanded }: PillProps): ReactElement => {
	const windowSize = useWindowSizeContext();
	const isMobile = windowSize.width && windowSize.width < Breakpoints.md;

	const rootCls = clsx(className, styles['c-pill'], {
		[styles['c-pill--expanded']]: isExpanded,
	});

	const renderTooltipPill = (): ReactElement => (
		<span className={rootCls}>
			<Tooltip position={isMobile ? 'right' : 'top'}>
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
