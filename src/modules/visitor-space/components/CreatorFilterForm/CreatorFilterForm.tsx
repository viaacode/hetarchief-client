import { yupResolver } from '@hookform/resolvers/yup';
import { CheckboxList } from '@meemoo/react-components';
import clsx from 'clsx';
import { compact, noop, without } from 'lodash-es';
import { FC, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { useGetIeObjectsAggregatesByField } from '@ie-objects/hooks/get-ie-objects-aggregates-by-field';
import { SearchBar } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects';
import { IeObjectsSearchFilter, IeObjectsSearchFilterField } from '@shared/types';
import { isEven } from '@shared/utils';
import { VISITOR_SPACE_QUERY_PARAM_CONFIG, visitorSpaceLabelKeys } from '@visitor-space/const';
import { ElasticsearchFieldNames, VisitorSpaceFilterId } from '@visitor-space/types';
import {
	mapFiltersToElastic,
	mapRefineFilterToElastic,
} from '@visitor-space/utils/elastic-filters';

import {
	CREATOR_FILTER_FORM_QUERY_PARAM_CONFIG,
	CREATOR_FILTER_FORM_SCHEMA,
} from './CreatorFilterForm.const';
import { CreatorFilterFormProps, CreatorFilterFormState } from './CreatorFilterForm.types';

const defaultValues = {
	creators: [],
};

const CreatorFilterForm: FC<CreatorFilterFormProps> = ({ children, className }) => {
	const { tHtml, tText } = useTranslation();

	// State
	const [query] = useQueryParams(CREATOR_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [currentSearchFilters] = useQueryParams(VISITOR_SPACE_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');
	const [selection, setSelection] = useState<string[]>(() => compact(query.creator || []));
	const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);

	const { setValue, reset, handleSubmit } = useForm<CreatorFilterFormState>({
		resolver: yupResolver(CREATOR_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const filters: IeObjectsSearchFilter[] = [
		...mapFiltersToElastic(currentSearchFilters),
		...mapRefineFilterToElastic([
			{
				field: IeObjectsSearchFilterField.CREATOR,
				value: search,
			},
		]),
	];

	const initialAggregates = useSelector(selectIeObjectsFilterOptions);
	const { data: aggregates } = useGetIeObjectsAggregatesByField(
		VisitorSpaceFilterId.Creator,
		filters,
		isSearchEnabled
	);

	const buckets = useMemo(() => {
		// TODO: add sort
		const initial = initialAggregates?.[ElasticsearchFieldNames.Creator]?.buckets;
		const result = aggregates || initial || [];

		return result;
	}, [aggregates, initialAggregates]);

	// Effects
	useEffect(() => {
		setValue('creators', selection);
	}, [selection, setValue]);

	useEffect(() => {
		setIsSearchEnabled(isEven(search.length));
	}, [search]);

	// Events
	const onItemClick = (add: boolean, value: string) => {
		const selected = add ? [...selection, value] : without(selection, value);
		setSelection(selected);
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<SearchBar
					id={`${visitorSpaceLabelKeys.filters.title}--${VisitorSpaceFilterId.Creator}`}
					value={search}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={tText(
						'modules/visitor-space/components/creator-filter-form/creator-filter-form___zoek'
					)}
					onChange={setSearch}
					onSearch={noop}
				/>

				<div className="u-my-32">
					{buckets.length === 0 && (
						<p className="u-color-neutral u-text-center">
							{tHtml(
								'modules/visitor-space/components/creator-filter-form/creator-filter-form___geen-makers-gevonden'
							)}
						</p>
					)}

					<CheckboxList
						items={buckets.map((bucket) => ({
							...bucket,
							value: bucket.key,
							label: bucket.key,
							checked: selection.includes(bucket.key),
						}))}
						onItemClick={(checked, value) => {
							onItemClick(!checked, value as string);
						}}
					/>
				</div>
			</div>

			{children({
				values: { creators: selection },
				reset: () => {
					reset();
					setSelection(defaultValues.creators);
					setSearch('');
				},
				handleSubmit,
			})}
		</>
	);
};

export default CreatorFilterForm;
