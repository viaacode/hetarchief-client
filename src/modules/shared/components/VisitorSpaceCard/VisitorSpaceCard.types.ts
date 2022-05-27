import { CardProps } from '@meemoo/react-components/dist/esm/components/Card/Card.types';

import { VisitorSpaceInfo } from '@visitor-space/types';

import { VisitorSpaceCardType } from './VisitorSpaceCard.const';

export interface VisitorSpaceAccess {
	granted?: boolean;
	pending?: boolean;
	from?: Date;
	until?: Date;
}

export interface VisitorSpaceCardProps extends CardProps {
	access?: VisitorSpaceAccess;
	onAccessRequest?: (room: Partial<Omit<VisitorSpaceInfo, 'status'>>) => void;
	onContactClick?: (room: Partial<Omit<VisitorSpaceInfo, 'status'>>) => void;
	room: Pick<VisitorSpaceInfo, 'logo' | 'id' | 'color' | 'image' | 'name' | 'info'> & {
		slug: string;
	};
	type: VisitorSpaceCardType;
}
