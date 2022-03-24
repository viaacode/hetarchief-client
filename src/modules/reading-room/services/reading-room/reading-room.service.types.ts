import { ReadingRoomInfo } from '@reading-room/types';

export interface CreateVisitRequest {
	spaceId: string;
	timeframe: string;
	reason: string;
	acceptedTos: boolean;
}

export type UpdateReadingRoomSettings = Pick<
	ReadingRoomInfo,
	'description' | 'color' | 'serviceDescription' | 'image'
>;

export enum AccessType {
	ACTIVE = 'ACTIVE',
	NO_ACCESS = 'NO_ACCESS',
}
