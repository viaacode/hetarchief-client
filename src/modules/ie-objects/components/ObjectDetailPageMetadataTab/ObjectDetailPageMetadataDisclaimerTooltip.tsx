import {
	Button,
	type ButtonProps,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import type { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './ObjectDetailPageMetadataDisclaimerTooltip.module.scss';

export interface ObjectDetailPageMetadataDisclaimerTooltipProps {
	iconName: IconNamesLight;
	ariaLabel: string;
	content: ReactNode;
	position?: 'top' | 'top-end' | 'left';
	className?: string;
}

export function ObjectDetailPageMetadataDisclaimerTooltip({
	iconName,
	ariaLabel,
	content,
	position = 'top',
	className,
}: ObjectDetailPageMetadataDisclaimerTooltipProps) {
	return (
		<NoServerSideRendering>
			<Tooltip
				position={position}
				offset={10}
				contentClassName={styles['c-object-detail-page-metadata-disclaimer-tooltip__content']}
			>
				<TooltipTrigger>
					<Button
						icon={<Icon name={iconName} aria-hidden />}
						ariaLabel={ariaLabel}
						className={clsx(styles['c-object-detail-page-metadata-disclaimer-tooltip'], className)}
						variants={['white']}
					/>
				</TooltipTrigger>
				<TooltipContent>{content}</TooltipContent>
			</Tooltip>
		</NoServerSideRendering>
	);
}
