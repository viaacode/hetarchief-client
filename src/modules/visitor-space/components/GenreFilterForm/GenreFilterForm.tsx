import { yupResolver } from '@hookform/resolvers/yup';
import { CheckboxList } from '@meemoo/react-components';
import clsx from 'clsx';
import { compact, without } from 'lodash-es';
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
	GENRE_FILTER_FORM_QUERY_PARAM_CONFIG,
	GENRE_FILTER_FORM_SCHEMA,
} from './GenreFilterForm.const';
import { GenreFilterFormProps, GenreFilterFormState } from './GenreFilterForm.types';

const defaultValues = {
	genres: [],
};

const GenreFilterForm: FC<GenreFilterFormProps> = ({ children, className }) => {
	const { tHtml, tText } = useTranslation();

	// State

	const [query] = useQueryParams(GENRE_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');
	const [selection, setSelection] = useState<string[]>(() => compact(query.genre || []));

	const { setValue, reset, handleSubmit } = useForm<GenreFilterFormState>({
		resolver: yupResolver(GENRE_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const buckets = (useSelector(selectIeObjectsFilterOptions)?.schema_genre.buckets || []).filter(
		(bucket) => bucket.key.toLowerCase().includes(search.toLowerCase())
	);

	// Effects

	useEffect(() => {
		setValue('genres', selection);
	}, [selection, setValue]);

	// Events

	const onItemClick = (add: boolean, value: string) => {
		const selected = add ? [...selection, value] : without(selection, value);
		setSelection(selected);
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<SearchBar
					id={`${visitorSpaceLabelKeys.filters.title}--${VisitorSpaceFilterId.Genre}`}
					default={search}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={tText(
						'modules/visitor-space/components/genre-filter-form/genre-filter-form___zoek'
					)}
					onSearch={(value) => setSearch(value || '')}
				/>

				<div className="u-my-32">
					{buckets.length === 0 && (
						<p className="u-color-neutral u-text-center u-my-16">
							{tHtml(
								'modules/visitor-space/components/genre-filter-form/genre-filter-form___geen-genres-gevonden'
							)}
						</p>
					)}

					<CheckboxList
						className="u-my-16 c-checkbox-list"
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
				values: { genres: selection },
				reset: () => {
					reset();
					setSelection(defaultValues.genres);
				},
				handleSubmit,
			})}
		</>
	);
};

export default GenreFilterForm;
