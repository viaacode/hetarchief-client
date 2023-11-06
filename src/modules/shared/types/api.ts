import type { IPagination } from '@studiohyperdrive/pagination';

import { IeObject, IeObjectSearchAggregation } from '@ie-objects/types';
import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { ElasticsearchFieldNames } from '@visitor-space/types';

export interface ElasticsearchAggregations {
	aggregations: {
		[ElasticsearchFieldNames.Format]: IeObjectSearchAggregation<string>;
	};
}

export interface IeObjectsSearchTerms {
	searchTerms: string[];
}

export type GetIeObjectsResponse = IPagination<IeObject & { related_count?: number }> &
	ElasticsearchAggregations &
	IeObjectsSearchTerms;

export type FilterOptions = {
	[IeObjectsSearchFilterField.OBJECT_TYPE]: string[];
	[IeObjectsSearchFilterField.LANGUAGE]: string[];
	[IeObjectsSearchFilterField.MEDIUM]: string[];
	[IeObjectsSearchFilterField.GENRE]: string[];
	[IeObjectsSearchFilterField.MAINTAINER_ID]: {
		id: string;
		name: string;
	}[];
};
