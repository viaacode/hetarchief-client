import { CardProps } from '@meemoo/react-components/dist/esm/components/Card/Card.types';

import { ReadingRoomInfo } from '@reading-room/types';

import { ReadingRoomCardType } from './ReadingRoomCard.const';

export interface ReadingRoomAccess {
	granted?: boolean;
	pending?: boolean;
	from?: Date;
	until?: Date;
}

export interface ReadingRoomCardProps extends CardProps {
	access?: ReadingRoomAccess;
	onAccessRequest?: (room: Partial<Omit<ReadingRoomInfo, 'status'>>) => void;
	onContactClick?: (room: Partial<Omit<ReadingRoomInfo, 'status'>>) => void;
	onVisitClick?: (room: Partial<Omit<ReadingRoomInfo, 'status'>>) => void;
	room: Partial<Omit<ReadingRoomInfo, 'status'>>;
	type: ReadingRoomCardType;
}
