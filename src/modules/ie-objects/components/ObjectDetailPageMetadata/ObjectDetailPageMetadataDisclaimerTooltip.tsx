import { Tooltip, TooltipContent, TooltipTrigger } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import type { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './ObjectDetailPageMetadataDisclaimerTooltip.module.scss';

export interface ObjectDetailPageMetadataDisclaimerTooltipProps {
	iconName: IconNamesLight;
	ariaLabel: string;
	content: ReactNode;
	position?: 'top' | 'top-end';
	iconSize?: 'base' | 'lg';
	className?: string;
}

export function ObjectDetailPageMetadataDisclaimerTooltip({
	iconName,
	ariaLabel,
	content,
	position = 'top',
	iconSize = 'base',
	className,
}: ObjectDetailPageMetadataDisclaimerTooltipProps) {
	return (
		<NoServerSideRendering>
			<Tooltip position={position} offset={10}>
				<TooltipTrigger>
					<button
						type="button"
						className={clsx(
							styles['c-object-detail-page-metadata-disclaimer-tooltip'],
							styles[`c-object-detail-page-metadata-disclaimer-tooltip--icon-${iconSize}`],
							className
						)}
						aria-label={ariaLabel}
					>
						<Icon name={iconName} aria-hidden />
					</button>
				</TooltipTrigger>
				<TooltipContent>{content}</TooltipContent>
			</Tooltip>
		</NoServerSideRendering>
	);
}
