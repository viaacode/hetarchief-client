import type { VisitorSpaceInfo } from '../../types';

export interface CreateVisitRequest {
	visitorSpaceSlug: string;
	timeframe?: string;
	reason: string;
	acceptedTos: boolean;
}

export type UpdateVisitorSpaceSettings = Pick<
	VisitorSpaceInfo,
	| 'descriptionNl'
	| 'serviceDescriptionNl'
	| 'descriptionEn'
	| 'serviceDescriptionEn'
	| 'color'
	| 'image'
	| 'status'
	| 'slug'
> & {
	file: File | null;
};

export type CreateVisitorSpaceSettings = UpdateVisitorSpaceSettings & {
	orId: string;
};

export enum AccessType {
	ACTIVE = 'ACTIVE',
	NO_ACCESS = 'NO_ACCESS',
}
