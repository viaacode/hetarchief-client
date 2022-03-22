import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
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
	// const { t } = useTranslation();

	// State

	const [query] = useQueryParams(MEDIUM_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');
	const [selection, setSelection] = useState<string[]>(() =>
		query.medium && query.medium !== null
			? (query.medium.filter((item) => item !== null) as string[])
			: []
	);

	const { setValue, getValues, reset } = useForm<MediumFilterFormState>({
		defaultValues: {
			mediums: [],
		},
		resolver: yupResolver(MEDIUM_FILTER_FORM_SCHEMA()),
	});

	// const buckets = useSelector(selectMediaResults)?.aggregations.schema_creator.buckets || [];

	// Events

	const onItemClick = (add: boolean, value: string) => {
		const selected = add ? [...selection, value] : selection.filter((item) => item !== value);

		setValue('mediums', selected);
		setSelection(selected);
	};

	// Helpers

	// const getMediumTranslation = (medium: string): string => {
	// 	const translation = medium; // TODO: change to 'let' when output is available

	// 	switch (medium) {
	// 		// case 'foo':
	// 		// 	translation = t('Foo');
	// 		// 	break;

	// 		default:
	// 			break;
	// 	}

	// 	return translation || '';
	// };

	// const getItems = () => {
	// 	return buckets
	// 		.filter((bucket) => bucket.key.toLowerCase().indexOf(search.toLowerCase()) !== -1)
	// 		.map((bucket) => {
	// 			const value = bucket.key || '';

	// 			return {
	// 				...bucket,
	// 				checked: selection.indexOf(value) !== -1,
	// 				label: getMediumTranslation(value),
	// 				value,
	// 			};
	// 		});
	// };

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<SearchBar
					searchValue={search}
					onSearch={setSearch}
					onClear={() => {
						setSearch('');
					}}
				/>

				{/* https://meemoo.atlassian.net/wiki/spaces/HA2/pages/3402891314/Geavanceerde+search+BZT+versie+1?focusedCommentId=3417604098#comment-3417604098 */}
				<p className="u-color-neutral u-text-center u-my-16">
					{'Missing "dcterms_medium"'}
				</p>

				<CheckboxList
					className="u-my-16"
					items={[]}
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
