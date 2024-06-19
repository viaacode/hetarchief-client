import { type CardProps } from '@meemoo/react-components';
import { type ReactNode } from 'react';

import { type VisitorSpaceInfo } from '@visitor-space/types';

import { type VisitorSpaceCardType } from './VisitorSpaceCard.const';

export interface VisitorSpaceAccess {
	granted?: boolean;
	pending?: boolean;
	from?: Date;
	until?: Date;
}

export interface VisitorSpaceCardProps extends CardProps {
	children?: ReactNode;
	access?: VisitorSpaceAccess;
	onAccessRequest?: (room: Partial<Omit<VisitorSpaceInfo, 'status'>>) => void;
	onContactClick?: (room: Partial<Omit<VisitorSpaceInfo, 'status'>>) => void;
	room: Pick<
		VisitorSpaceInfo,
		'logo' | 'id' | 'color' | 'image' | 'name' | 'info' | 'contactInfo'
	> & {
		slug: string;
	};
	type: VisitorSpaceCardType;
}
