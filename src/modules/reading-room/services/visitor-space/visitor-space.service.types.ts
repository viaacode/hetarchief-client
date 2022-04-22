import { VisitorSpaceInfo } from '@reading-room/types';

export interface CreateVisitRequest {
	visitorSpaceSlug: string;
	timeframe?: string;
	reason: string;
	acceptedTos: boolean;
}

export type ReadingRoomSettings = Pick<
	VisitorSpaceInfo,
	'description' | 'color' | 'serviceDescription' | 'image' | 'status'
>;

export interface UpdateReadingRoomSettings extends ReadingRoomSettings {
	file: File | null;
}

export enum AccessType {
	ACTIVE = 'ACTIVE',
	NO_ACCESS = 'NO_ACCESS',
}
