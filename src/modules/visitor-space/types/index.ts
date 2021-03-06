import { SelectOption, TagInfo } from '@meemoo/react-components';
import { ReactNode } from 'react';
import { UseFormHandleSubmit } from 'react-hook-form';
import { DecodedValueMap } from 'use-query-params';

import { DefaultComponentProps, MediaTypes, Operator } from '@shared/types';

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
}

export enum VisitorSpaceFilterId {
	Advanced = 'advanced',
	Created = 'created',
	Creator = 'creator',
	Duration = 'duration',
	Genre = 'genre',
	Keywords = 'keywords',
	Language = 'language',
	Medium = 'medium',
	Published = 'published',
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

export interface DefaultFilterFormChildrenParams<Values = unknown> {
	values: Values;
	reset: () => void;
	handleSubmit: UseFormHandleSubmit<Values>;
}

export interface DefaultFilterFormProps<Values = unknown> extends DefaultComponentProps {
	children: ({
		values,
		reset,
		handleSubmit,
	}: DefaultFilterFormChildrenParams<Values>) => ReactNode;
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
		value: MediaTypes;
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
