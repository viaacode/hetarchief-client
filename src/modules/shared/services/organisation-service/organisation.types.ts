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
