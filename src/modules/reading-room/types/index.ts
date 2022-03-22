import { SelectOption, TagInfo } from '@meemoo/react-components';
import { ReactNode } from 'react';

import { DefaultComponentProps, MediaTypes, Operator } from '@shared/types';

import { MetadataProp } from './metadata';

export * from './metadata';

export enum ReadingRoomSort {
	Date = 'schema_date_created',
	Relevance = '_score',
	Title = 'schema_name',
}

export enum ReadingRoomFilterId {
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

export interface DefaultFilterFormChildrenParams<Values = unknown> {
	values: Values;
	reset: () => void;
}

export interface DefaultFilterFormProps<Values = unknown> extends DefaultComponentProps {
	children: ({ values, reset }: DefaultFilterFormChildrenParams<Values>) => ReactNode;
	values?: Values;
}

export interface ReadingRoomInfo {
	id: string;
	maintainerId: string;
	name: string;
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
		address: {
			street: string;
			postalCode: string;
			locality: string;
		};
	};
	isPublished: boolean;
	publishedAt: string | null;
	createdAt: string;
	updatedAt: string;
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
}
