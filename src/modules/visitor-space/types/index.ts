import { SelectOption, TagInfo } from '@meemoo/react-components';
import { ReactNode } from 'react';
import { UseFormHandleSubmit } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/fields';
import { DecodedValueMap } from 'use-query-params';

import { DefaultComponentProps, IeObjectTypes, Operator } from '@shared/types';
import { OnFilterMenuFormSubmit } from '@visitor-space/components';

import { VISITOR_SPACE_QUERY_PARAM_CONFIG } from '../const';

import { MetadataProp } from './metadata';

export * from './metadata';

export type VisitorSpaceQueryParams = Partial<
	DecodedValueMap<typeof VISITOR_SPACE_QUERY_PARAM_CONFIG>
>;

export enum VisitorSpaceSort {
	Date = 'created',
	Relevance = 'relevance',
	Title = 'name',
	Archived = 'archived',
}

export enum VisitorSpaceFilterId {
	Format = 'format',
	Advanced = 'advanced',
	Created = 'created',
	Creator = 'creator',
	Duration = 'duration',
	Genre = 'genre',
	Keywords = 'keywords',
	Language = 'language',
	Medium = 'medium',
	Published = 'published',
	Maintainer = 'aanbieder',
	Maintainers = 'aanbieders',
	ConsultableOnlyOnLocation = 'onLocation',
	ConsultableMedia = 'media',
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
	ContentPartnerName = 'content_partner.schema_name',
	ContentPartnerId = 'content_partner.schema_identifier',
}

export interface DefaultFilterFormChildrenParams<Values extends FieldValues> {
	values: Values;
	reset: () => void;
	handleSubmit: UseFormHandleSubmit<Values>;
}

export interface DefaultFilterFormProps<Values extends FieldValues> extends DefaultComponentProps {
	children: ({
		values,
		reset,
		handleSubmit,
	}: DefaultFilterFormChildrenParams<Values>) => ReactNode;
	disabled?: boolean;
	values?: Values;
}

export interface InlineFilterFormProps<Values = unknown> extends DefaultComponentProps {
	id: VisitorSpaceFilterId;
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
	description: string | null;
	serviceDescription: string | null;
	image: string | null;
	color: string | null;
	logo: string;
	audienceType: string;
	publicAccess: boolean;
	contactInfo: {
		email: string | null;
		telephone: string | null;
		address?: {
			street: string;
			postalCode: string;
			locality: string;
		};
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
		value: IeObjectTypes;
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
		value: MetadataProp;
	}
>;

export interface AdvancedFilter {
	prop?: string; // Which property/field is being filtered on
	op?: string; // Which operator, see Operator enum
	val?: string; // stringified value, potentially character-separated
}

export interface TagIdentity extends Partial<AdvancedFilter>, TagInfo {
	key: string;
	id: string | number;
}
