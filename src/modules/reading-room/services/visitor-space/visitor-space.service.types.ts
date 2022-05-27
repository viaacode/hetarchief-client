import { VisitorSpaceInfo } from '@reading-room/types';

export interface CreateVisitRequest {
	visitorSpaceSlug: string;
	timeframe?: string;
	reason: string;
	acceptedTos: boolean;
}

export type ReadingRoomSettings = Pick<
	VisitorSpaceInfo,
	'description' | 'color' | 'serviceDescription' | 'image' | 'status' | 'slug'
>;

export interface UpdateReadingRoomSettings extends ReadingRoomSettings {
	file: File | null;
}

export interface CreateReadingRoomSettings extends ReadingRoomSettings {
	file: File | null;
	orId: string;
}

export enum AccessType {
	ACTIVE = 'ACTIVE',
	NO_ACCESS = 'NO_ACCESS',
}
