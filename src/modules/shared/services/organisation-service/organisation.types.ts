import { type IeObjectSector } from '@ie-objects/ie-objects.types';

export interface Organisation {
	schemaIdentifier: string;
	contactPoint: OrganisationContactPoint[];
	description: string;
	logo: {
		iri: string;
	};
	slug: string | null;
	primarySite: OrganisationPrimarySite;
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

export interface OrganisationPrimarySite {
	address: OrganisationPrimarySiteAddress;
}

export interface OrganisationPrimarySiteAddress {
	locality: string;
	postal_code: string;
	street: string;
	telephone: string;
	post_office_box_number: string;
}
