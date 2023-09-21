import { yupResolver } from '@hookform/resolvers/yup';
import { CheckboxList } from '@meemoo/react-components';
import clsx from 'clsx';
import { compact, keyBy, mapValues, noop, without } from 'lodash-es';
import { FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { SearchBar } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects';
import { MaintainerFilterFormProps, MaintainerFilterFormState } from '@visitor-space/components';
import { visitorSpaceLabelKeys } from '@visitor-space/const';
import { useGetContentPartners } from '@visitor-space/hooks/get-content-partner';
import {
	ElasticsearchFieldNames,
	FILTER_LABEL_VALUE_DELIMITER,
	VisitorSpaceFilterId,
} from '@visitor-space/types';

import {
	MAINTAINER_FILTER_FORM_QUERY_PARAM_CONFIG,
	MAINTAINER_FILTER_FORM_SCHEMA,
} from './MaintainerFilterForm.const';

const defaultValues = {
	maintainers: [],
};

const MaintainerFilterForm: FC<MaintainerFilterFormProps> = ({ children, className }) => {
	const { tHtml, tText } = useTranslation();

	const [query] = useQueryParams(MAINTAINER_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');
	const [selectedMaintainerIds, setSelectedMaintainerIds] = useState<string[]>(() =>
		compact(
			(query[VisitorSpaceFilterId.Maintainers] || []).map(
				(maintainerIdAndName) =>
					maintainerIdAndName?.split(FILTER_LABEL_VALUE_DELIMITER)?.[0]
			)
		)
	);

	const { setValue, reset, handleSubmit } = useForm<MaintainerFilterFormState>({
		resolver: yupResolver(MAINTAINER_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	// Get all maintainer names
	const { data: maintainers } = useGetContentPartners({});
	const maintainerNames = mapValues(
		keyBy(maintainers || [], (m) => m.id),
		(v) => v.name
	);

	const buckets =
		useSelector(selectIeObjectsFilterOptions)?.[ElasticsearchFieldNames.Maintainer]?.buckets ||
		[];

	const filteredBuckets = buckets
		.map((bucket) => ({
			...bucket,
			name: maintainerNames?.[bucket.key] || bucket.key,
		}))
		.filter((bucket) => bucket.name.toLowerCase().includes(search.toLowerCase()));

	const checkboxOptions = filteredBuckets.map((bucket) => {
		return {
			value: bucket.key,
			label: bucket.name || bucket.key,
			checked: selectedMaintainerIds.includes(bucket.key),
		};
	});

	const idToIdAndNameConcatinated = useCallback(
		(id: string) => {
			if (!maintainers) {
				return '';
			}
			return `${id}${FILTER_LABEL_VALUE_DELIMITER}${maintainerNames?.[id] || ''}`;
		},
		[maintainers, maintainerNames]
	);

	useEffect(() => {
		setValue('maintainers', selectedMaintainerIds.map(idToIdAndNameConcatinated));
	}, [selectedMaintainerIds, setValue, idToIdAndNameConcatinated]);

	const onItemClick = (checked: boolean, value: unknown): void => {
		const newSelectedMaintainers = !checked
			? [...selectedMaintainerIds, value as string]
			: without(selectedMaintainerIds, value as string);
		setSelectedMaintainerIds(newSelectedMaintainers);
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<SearchBar
					id={`${visitorSpaceLabelKeys.filters.title}--${VisitorSpaceFilterId.Maintainers}`}
					value={search}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={tText(
						'modules/visitor-space/components/maintainers-filter-form/maintainers-filter-form___zoek'
					)}
					onChange={setSearch}
					onSearch={noop}
				/>

				<div className="u-my-32">
					{filteredBuckets.length === 0 && (
						<p className="u-color-neutral u-text-center">
							{tHtml(
								'modules/visitor-space/components/maintainers-filter-form/maintainers-filter-form___geen-aanbieders-gevonden'
							)}
						</p>
					)}

					{maintainers && (
						<CheckboxList items={checkboxOptions} onItemClick={onItemClick} />
					)}
				</div>
			</div>

			{children({
				values: {
					maintainers: selectedMaintainerIds.map(idToIdAndNameConcatinated),
				},
				reset: () => {
					reset();
					setSelectedMaintainerIds(defaultValues.maintainers);
					setSearch('');
				},
				handleSubmit,
			})}
		</>
	);
};

export default MaintainerFilterForm;
