import { ReadingRoomCardType } from './ReadingRoomCard.const';

export interface ReadingRoom {
	color?: string;
	description?: string;
	id: string | number;
	image?: string;
	logo?: string;
	name?: string;
}

export interface ReadingRoomAccess {
	granted?: boolean;
	pending?: boolean;
	from?: Date;
	until?: Date;
}

export interface ReadingRoomCardProps {
	access?: ReadingRoomAccess;
	onAccessRequest?: (room: ReadingRoom) => void;
	onClick?: () => void;
	onContactClick?: (room: ReadingRoom) => void;
	onVisitClick?: (room: ReadingRoom) => void;
	room: ReadingRoom;
	type: ReadingRoomCardType;
}
