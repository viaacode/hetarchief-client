import { ReadingRoomInfo } from '@reading-room/types';

import { ReadingRoomCardType } from './ReadingRoomCard.const';

export interface ReadingRoomAccess {
	granted?: boolean;
	pending?: boolean;
	from?: Date;
	until?: Date;
}

export interface ReadingRoomCardProps {
	access?: ReadingRoomAccess;
	onAccessRequest?: (room: Partial<ReadingRoomInfo>) => void;
	onContactClick?: (room: Partial<ReadingRoomInfo>) => void;
	onVisitClick?: (room: Partial<ReadingRoomInfo>) => void;
	room: Partial<ReadingRoomInfo>;
	type: ReadingRoomCardType;
}
