import { readingRoomCardType } from './ReadingRoomCard.constants';

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
}

export interface ReadingRoomProps {
	access?: ReadingRoomAccess;
	onAccessRequest?: (room: ReadingRoom) => void;
	onContactClick?: (room: ReadingRoom) => void;
	onVisitClick?: (room: ReadingRoom) => void;
	room: ReadingRoom;
	type: readingRoomCardType;
}
