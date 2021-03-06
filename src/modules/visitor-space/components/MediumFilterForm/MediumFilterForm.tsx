import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { compact, without } from 'lodash-es';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { SearchBar } from '@shared/components';
import { CheckboxList } from '@shared/components/CheckboxList';
import { selectMediaFilterOptions } from '@shared/store/media';

import {
	MEDIUM_FILTER_FORM_QUERY_PARAM_CONFIG,
	MEDIUM_FILTER_FORM_SCHEMA,
} from './MediumFilterForm.const';
import { MediumFilterFormProps, MediumFilterFormState } from './MediumFilterForm.types';

const defaultValues = {
	mediums: [],
};

const MediumFilterForm: FC<MediumFilterFormProps> = ({ children, className }) => {
	const { t } = useTranslation();

	// State

	const [query] = useQueryParams(MEDIUM_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');
	const [selection, setSelection] = useState<string[]>(() => compact(query.medium || []));

	const { setValue, reset, handleSubmit } = useForm<MediumFilterFormState>({
		resolver: yupResolver(MEDIUM_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const buckets = (useSelector(selectMediaFilterOptions)?.dcterms_medium.buckets || []).filter(
		(bucket) => bucket.key.toLowerCase().includes(search.toLowerCase())
	);

	// Effects

	useEffect(() => {
		setValue('mediums', selection);
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
					default={search}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={t(
						'modules/visitor-space/components/medium-filter-form/medium-filter-form___zoek'
					)}
					onSearch={(value) => setSearch(value || '')}
				/>

				<div className="u-my-32">
					{buckets.length === 0 && (
						<p className="u-color-neutral u-text-center">
							{t(
								'modules/visitor-space/components/medium-filter-form/medium-filter-form___geen-analoge-dragers-gevonden'
							)}
						</p>
					)}

					<CheckboxList
						items={buckets.map((bucket) => ({
							...bucket,
							checked: selection.includes(bucket.key),
							label: bucket.key,
							value: bucket.key,
						}))}
						onItemClick={(checked, value) => {
							onItemClick(!checked, value as string);
						}}
					/>
				</div>
			</div>

			{children({
				values: { mediums: selection },
				reset: () => {
					reset();
					setSelection(defaultValues.mediums);
				},
				handleSubmit,
			})}
		</>
	);
};

export default MediumFilterForm;
