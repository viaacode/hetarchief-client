import type { SelectOption, TagInfo } from '@meemoo/react-components';

import type { IeObjectType } from '@shared/types/ie-objects';

import type { Operator } from './filter-properties';

export * from './filter-properties';

export enum SearchSortProp {
	Date = 'created',
	Relevance = 'relevance',
	Title = 'name',
	Archived = 'archived',
}

export enum SearchFilterId {
	Query = 'query',
	Title = 'title',
	Description = 'description',
	Format = 'format',
	Advanced = 'advanced',
	Created = 'created',
	Published = 'published',
	ReleaseDate = 'releaseDate',
	Creator = 'creator',
	Publisher = 'publisher',
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

export interface DefaultFilterFormProps {
	id: SearchFilterId;
	label: string;
	className?: string;
	disabled?: boolean;
	onSubmit: (newFormValue: FilterValue) => void;
	onReset: () => void;
	initialValue?: FilterValue;
}

export interface DefaultFilterArrayFormProps {
	id: SearchFilterId;
	className?: string;
	disabled?: boolean;
	onSubmit: (newFormValues: FilterValue[]) => void;
	onReset: () => void;
	initialValues?: FilterValue[];
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
		value: SearchFilterId;
	}
>;

export interface FilterValue {
	prop?: SearchFilterId; // Which property/field is being filtered on
	op?: Operator; // Which operator, see Operator enum
	val?: string; // stringified value, potentially character-separated
	multiValue?: string[];
}

export interface TagIdentity extends Partial<FilterValue>, TagInfo {
	key: string;
	id: string | number;
}
