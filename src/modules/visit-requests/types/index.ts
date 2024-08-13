import { type AccessType, type VisitStatus } from '@shared/types/visit';

export * from './requests.types';

export enum VisitTimeframe {
	ACTIVE = 'ACTIVE',
	PAST = 'PAST',
	FUTURE = 'FUTURE',
}

export interface PatchVisit {
	status?: VisitStatus;
	startAt?: string;
	endAt?: string;
	note?: string;
	accessType?: AccessType;
	accessFolderIds?: string[];
}

export interface UpdateVisit {
	id: string;
	updatedProps: PatchVisit;
}
