import { readingRoomCardType } from './ReadingRoomCard.constants';

export interface IReadingRoomProps {
	type: readingRoomCardType;
	backgroundColor?: string;
	backgroundImage?: string;
	logo: string;
	title: string;
	description: string;
}
