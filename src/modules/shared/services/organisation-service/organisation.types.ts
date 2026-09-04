import type { HetArchiefIeObjectSector } from '@viaa/avo2-types';

export interface Organisation {
	schemaIdentifier: string;
	contactPoint: OrganisationContactPoint[];
	description: string;
	logo: string | null;
	slug: string | null;
	schemaName: string;
	createdAt: string;
	updatedAt: string;
	sector: HetArchiefIeObjectSector | null;
	formUrl: string | null;
}

interface OrganisationContactPoint {
	contactType: string;
	email: string;
}

export interface OrganisationListItem {
	id: string;
	org_identifier: string;
	name: string;
	slug: string;
}

export interface GetOrganisationsProps {
	query?: string;
	page?: number;
	size?: number;
	orderProp?: keyof OrganisationListItem;
	orderDirection?: string;
}

export interface UpdateOrganisationProps {
	slug: string;
}
