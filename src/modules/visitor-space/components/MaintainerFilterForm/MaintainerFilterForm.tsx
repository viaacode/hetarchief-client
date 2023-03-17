import { yupResolver } from '@hookform/resolvers/yup';
import { CheckboxList } from '@meemoo/react-components';
import clsx from 'clsx';
import { compact, without } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { SearchBar } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects';
import { visitorSpaceLabelKeys } from '@visitor-space/const';
import { VisitorSpaceFilterId } from '@visitor-space/types';

import {
	MAINTAINER_FILTER_FORM_QUERY_PARAM_CONFIG,
	MAINTAINER_FILTER_FORM_SCHEMA,
} from './MaintainerFilterForm.const';
import { MaintainerFilterFormProps, MaintainerFilterFormState } from './MaintainerFilterForm.types';

const defaultValues = {
	maintainers: [],
};

const MaintainerFilterForm: FC<MaintainerFilterFormProps> = ({ children, className }) => {
	const { tHtml, tText } = useTranslation();

	const [query] = useQueryParams(MAINTAINER_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');
	const [shouldReset, setShouldReset] = useState<boolean>(false);
	const [selection, setSelection] = useState<string[]>(() =>
		compact(query[VisitorSpaceFilterId.Maintainers] || [])
	);

	const { setValue, reset, handleSubmit } = useForm<MaintainerFilterFormState>({
		resolver: yupResolver(MAINTAINER_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const buckets = (
		useSelector(selectIeObjectsFilterOptions)?.schema_maintainer?.schema_identifier?.buckets ||
		[]
	).filter((bucket) => bucket.key.toLowerCase().includes(search.toLowerCase()));

	useEffect(() => {
		setValue('maintainers', selection);
	}, [selection, setValue]);

	const onItemClick = (checked: boolean, value: unknown): void => {
		const selected = !checked ? [...selection, `${value}`] : without(selection, `${value}`);
		setSelection(selected);
	};

	const onSearch = (value: string | undefined): void => setSearch(value || '');

	const onResetFinished = (): void => setShouldReset(false);

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<SearchBar
					id={`${visitorSpaceLabelKeys.filters.title}--${VisitorSpaceFilterId.Maintainers}`}
					default={search}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={tText(
						'modules/visitor-space/components/maintainers-filter-form/maintainers-filter-form___zoek'
					)}
					onSearch={onSearch}
					shouldReset={shouldReset}
					onResetFinished={onResetFinished}
				/>

				<div className="u-my-32">
					{buckets.length === 0 && (
						<p className="u-color-neutral u-text-center">
							{tHtml(
								'modules/visitor-space/components/maintainers-filter-form/maintainers-filter-form___geen-aanbieders-gevonden'
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
						onItemClick={onItemClick}
					/>
				</div>
			</div>

			{children({
				values: { maintainers: selection },
				reset: () => {
					reset();
					setSelection(defaultValues.maintainers);
					setSearch('');
					setShouldReset(true);
				},
				handleSubmit,
			})}
		</>
	);
};

export default MaintainerFilterForm;
