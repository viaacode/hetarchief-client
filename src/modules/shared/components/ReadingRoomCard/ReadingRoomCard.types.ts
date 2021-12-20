import { readingRoomCardType } from './ReadingRoomCard.constants';

export interface ReadingRoomProps {
	type: readingRoomCardType;
	backgroundColor?: string;
	backgroundImage?: string;
	logo: string;
	title: string;
	description: string;
}
