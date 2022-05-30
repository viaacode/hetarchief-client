import { VisitorSpaceInfo } from '../../types';

export interface CreateVisitRequest {
	visitorSpaceSlug: string;
	timeframe?: string;
	reason: string;
	acceptedTos: boolean;
}

export type VisitorSpaceSettings = Pick<
	VisitorSpaceInfo,
	'description' | 'color' | 'serviceDescription' | 'image' | 'status' | 'slug'
>;

export interface UpdateVisitorSpaceSettings extends VisitorSpaceSettings {
	file: File | null;
}

export interface CreateVisitorSpaceSettings extends VisitorSpaceSettings {
	file: File | null;
	orId: string;
}

export enum AccessType {
	ACTIVE = 'ACTIVE',
	NO_ACCESS = 'NO_ACCESS',
}
