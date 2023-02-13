export interface MaterialRequest {
	type: MaterialRequestType;
	requesterName: string;
	requesterEmail: string;
	maintainer: string;
	createdAt: string;
}

export enum MaterialRequestType {
	REUSE = 'HERGEBRUIK',
	MORE_INFO = 'MEER_INFO',
	VIEW = 'BEKIJKEN',
}

export type MaterialRequestRow = { row: { original: MaterialRequest } };
