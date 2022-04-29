import { CardProps } from '@meemoo/react-components/dist/esm/components/Card/Card.types';

import { VisitorSpaceInfo } from '@reading-room/types';

import { ReadingRoomCardType } from './ReadingRoomCard.const';

export interface ReadingRoomAccess {
	granted?: boolean;
	pending?: boolean;
	from?: Date;
	until?: Date;
}

export interface VisitorSpaceCardProps extends CardProps {
	access?: ReadingRoomAccess;
	onAccessRequest?: (room: Partial<Omit<VisitorSpaceInfo, 'status'>>) => void;
	onContactClick?: (room: Partial<Omit<VisitorSpaceInfo, 'status'>>) => void;
	room: Pick<VisitorSpaceInfo, 'logo' | 'id' | 'color' | 'image' | 'name' | 'info'> & {
		slug: string;
	};
	type: ReadingRoomCardType;
}
