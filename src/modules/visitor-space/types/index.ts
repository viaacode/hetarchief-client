import type { DefaultComponentProps } from '@meemoo/admin-core-ui/dist/admin.mjs';
import type { SelectOption, TagInfo } from '@meemoo/react-components';
import type { ReactNode } from 'react';
import type { FieldValues, UseFormHandleSubmit } from 'react-hook-form';

import type { IeObjectType } from '@shared/types/ie-objects';
import type { OnFilterMenuFormSubmit } from '@visitor-space/components/FilterMenu/FilterMenu.types';

import type { FilterProperty, Operator } from './filter-properties';

export * from './filter-properties';

export enum SearchSortProp {
	Date = 'created',
	Relevance = 'relevance',
	Title = 'name',
	Archived = 'archived',
}

export enum SearchFilterId {
	Format = 'format',
	Advanced = 'advanced',
	Created = 'created',
	Published = 'published',
	ReleaseDate = 'releaseDate',
	Creator = 'creator',
	Duration = 'duration',
	Genre = 'genre',
	Keywords = 'keywords',
	Language = 'language',
	NewspaperSeriesName = 'newspaperSeriesName',
	LocationCreated = 'locationCreated',
	Mentions = 'mentions', // Fallen soldiers named in newspapers
	Medium = 'medium',
	Maintainer = 'aanbieder',
	Maintainers = 'aanbieders',
	ConsultableOnlyOnLocation = 'onLocation',
	ConsultableMedia = 'media',
	ConsultablePublicDomain = 'publicDomain',
	ObjectType = 'objectType',
	Cast = 'cast',
	SpacialCoverage = 'spacialCoverage',
	TemporalCoverage = 'temporalCoverage',
	Identifier = 'identifier',
}

export enum ElasticsearchFieldNames {
	Medium = 'dcterms_medium',
	Genre = 'schema_genre',
	Language = 'schema_in_language',
	Format = 'dcterms_format',
	ObjectType = 'ebucore_object_type',
	Maintainer = 'schema_maintainer.schema_identifier',
}

export enum VisitorSpaceOrderProps {
	Id = 'id',
	Image = 'schema_image',
	Color = 'schema_color',
	Audience = 'schema_audience_type',
	Description = 'schema_description',
	PublicAccess = 'schema_public_access',
	ServiceDescription = 'schema_service_description',
	Status = 'status',
	PublishedAt = 'published_at',
	CreatedAt = 'created_at',
	UpdatedAt = 'updated_at',
	OrganisationName = 'organisation.skos_pref_label',
	OrganisationOrgId = 'organisation.org_identifier',
}

export interface DefaultFilterFormChildrenParams<Values extends FieldValues> {
	values: Values;
	reset: () => void;
	handleSubmit: UseFormHandleSubmit<Values>;
}

export interface DefaultFilterFormProps<Values extends FieldValues>
	extends Omit<DefaultComponentProps, 'children'> {
	children: ({ values, reset, handleSubmit }: DefaultFilterFormChildrenParams<Values>) => ReactNode;
	disabled?: boolean;
	values?: Values;
}

export interface InlineFilterFormProps<Values = unknown> extends DefaultComponentProps {
	children?: ReactNode;
	id: SearchFilterId;
	label: string;
	onFormSubmit: OnFilterMenuFormSubmit;
	disabled?: boolean;
	values?: Values;
}

export interface VisitorSpaceInfo {
	id: string;
	slug: string;
	maintainerId: string;
	name: string;
	info: string | null;
	descriptionNl: string | null;
	serviceDescriptionNl: string | null;
	descriptionEn: string | null;
	serviceDescriptionEn: string | null;
	image: string | null;
	color: string | null;
	logo: string;
	audienceType: string;
	publicAccess: boolean;
	contactInfo: {
		email: string | null;
		telephone: string | null;
	};
	status: VisitorSpaceStatus;
	publishedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export enum VisitorSpaceStatus {
	Active = 'ACTIVE',
	Inactive = 'INACTIVE',
	Requested = 'REQUESTED',
}

export type MediaTypeOptions = Array<
	SelectOption & {
		label: string;
		value: IeObjectType | null;
	}
>;

export type OperatorOptions = Array<
	SelectOption & {
		label: string;
		value: Operator;
	}
>;

export type PropertyOptions = Array<
	SelectOption & {
		label: string;
		value: FilterProperty;
	}
>;

export interface AdvancedFilter {
	renderKey: string; // Unique key for the filter, used by react to render the filter in the UI
	prop?: string; // Which property/field is being filtered on
	op?: string; // Which operator, see Operator enum
	val?: string; // stringified value, potentially character-separated
}

export interface IdentityAdvancedFilter extends AdvancedFilter {
	id: string;
}

export interface TagIdentity extends Partial<AdvancedFilter>, TagInfo {
	key: string;
	id: string | number;
}
