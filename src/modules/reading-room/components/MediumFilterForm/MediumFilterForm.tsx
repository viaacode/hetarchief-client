import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { SearchBar } from '@shared/components';
import { CheckboxList } from '@shared/components/CheckboxList';
import { selectMediaFormatAggregates } from '@shared/store/media';

import { MEDIUM_FILTER_FORM_SCHEMA } from './MediumFilterForm.const';
import { MediumFilterFormProps, MediumFilterFormState } from './MediumFilterForm.types';

const MediumFilterForm: FC<MediumFilterFormProps> = ({ children, className }) => {
	const { t } = useTranslation();

	// State

	const [query, setQuery] = useState<string | undefined>(undefined);
	const [selection, setSelection] = useState<string[]>([]);

	const { setValue, getValues, reset } = useForm<MediumFilterFormState>({
		defaultValues: {
			mediums: [],
		},
		resolver: yupResolver(MEDIUM_FILTER_FORM_SCHEMA()),
	});

	const aggregates = useSelector(selectMediaFormatAggregates);

	// Events

	const onItemClick = (add: boolean, value: string) => {
		add
			? setSelection([...selection, value])
			: setSelection(selection.filter((item) => item !== value));
	};

	// Effects

	useEffect(() => {
		setValue('mediums', selection);
	}, [setValue, selection]);

	// Helpers

	const getMediumTranslation = (medium: string): string => {
		let translation = medium;

		switch (medium) {
			case 'audio':
				translation = t('Audio');
				break;

			case 'video':
				translation = t('Video');
				break;

			case 'film':
				translation = t('Film');
				break;

			default:
				break;
		}

		return translation || '';
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<SearchBar
					searchValue={query}
					onSearch={setQuery}
					onClear={() => {
						setQuery('');
					}}
				/>

				<CheckboxList
					className="u-my-16"
					items={(aggregates?.buckets || [])
						.filter((bucket) => {
							return (
								!query || (query && bucket.key && bucket.key.indexOf(query) >= 0)
							);
						})
						.map((bucket) => {
							const value = bucket.key || '';

							return {
								...bucket,
								checked: selection.indexOf(value) >= 0,
								label: getMediumTranslation(value),
								value,
							};
						})}
					onItemClick={(checked, value) => {
						onItemClick(!checked, value as string);
					}}
				/>
			</div>

			{children({ values: getValues(), reset })}
		</>
	);
};

export default MediumFilterForm;
