import { VisitStatus } from '@shared/types';

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
}

export interface UpdateVisit {
	id: string;
	updatedProps: PatchVisit;
}
