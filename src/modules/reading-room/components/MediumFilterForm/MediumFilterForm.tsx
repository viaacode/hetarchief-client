import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { compact, without } from 'lodash-es';
import { useTranslation } from 'next-i18next';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';

import { SearchBar } from '@shared/components';
import { CheckboxList } from '@shared/components/CheckboxList';

import {
	MEDIUM_FILTER_FORM_QUERY_PARAM_CONFIG,
	MEDIUM_FILTER_FORM_SCHEMA,
} from './MediumFilterForm.const';
import { MediumFilterFormProps, MediumFilterFormState } from './MediumFilterForm.types';

const MediumFilterForm: FC<MediumFilterFormProps> = ({ children, className }) => {
	const { t } = useTranslation();

	// State

	const [query] = useQueryParams(MEDIUM_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');
	const [selection, setSelection] = useState<string[]>(() => compact(query.medium || []));

	const { setValue, getValues, reset } = useForm<MediumFilterFormState>({
		defaultValues: {
			mediums: [],
		},
		resolver: yupResolver(MEDIUM_FILTER_FORM_SCHEMA()),
	});

	// const buckets = (
	// 	useSelector(selectMediaResults)?.aggregations.dcterms_medium.buckets || []
	// ).filter((bucket) => bucket.key.toLowerCase().includes(search.toLowerCase()));

	// Events

	const onItemClick = (add: boolean, value: string) => {
		const selected = add ? [...selection, value] : without(selection, value);

		setValue('mediums', selected);
		setSelection(selected);
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<SearchBar
					searchValue={search}
					onSearch={setSearch}
					onClear={() => setSearch('')}
				/>

				{/* https://meemoo.atlassian.net/wiki/spaces/HA2/pages/3402891314/Geavanceerde+search+BZT+versie+1?focusedCommentId=3417604098#comment-3417604098 */}
				<p className="u-color-neutral u-text-center u-my-16">
					{t(
						'modules/reading-room/components/medium-filter-form/medium-filter-form___geen-analoge-dragers-gevonden'
					)}
				</p>

				<CheckboxList
					className="u-my-16"
					items={[]}
					// items={buckets.map((bucket) => ({
					// 	...bucket,
					// 	checked: selection.includes(bucket.key),
					// 	label: bucket.key,
					// 	value: bucket.key,
					// }))}
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
