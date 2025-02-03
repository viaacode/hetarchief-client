import type { IeObjectSector } from '@ie-objects/ie-objects.types';

export interface Organisation {
	schemaIdentifier: string;
	contactPoint: OrganisationContactPoint[];
	description: string;
	logo: string | null;
	slug: string | null;
	schemaName: string;
	createdAt: string;
	updatedAt: string;
	sector: IeObjectSector | null;
	formUrl: string | null;
}

export interface OrganisationContactPoint {
	contactType: string;
	email: string;
}
