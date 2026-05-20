import type { Organisation } from '@admin/views/organisations/organisations.types';

export interface GetOrganisationsProps {
	query?: string;
	page?: number;
	size?: number;
	orderProp?: keyof Organisation;
	orderDirection?: string;
}

export interface UpdateOrganisationProps {
	slug: string;
}
