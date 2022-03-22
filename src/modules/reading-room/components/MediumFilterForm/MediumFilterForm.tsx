import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';

import { SearchBar } from '@shared/components';
import { CheckboxList } from '@shared/components/CheckboxList';

import { MEDIUM_FILTER_FORM_SCHEMA } from './MediumFilterForm.const';
import { MediumFilterFormProps, MediumFilterFormState } from './MediumFilterForm.types';

const MediumFilterForm: FC<MediumFilterFormProps> = ({ children, className }) => {
	// const { t } = useTranslation();

	// State

	const [query, setQuery] = useState<string | undefined>(undefined);
	const [selection, setSelection] = useState<string[]>([]);

	const { setValue, getValues, reset } = useForm<MediumFilterFormState>({
		defaultValues: {
			mediums: [],
		},
		resolver: yupResolver(MEDIUM_FILTER_FORM_SCHEMA()),
	});

	// TODO: create selector
	// const aggregates = useSelector(selectMediaMediumAggregates);

	// Events

	const onItemClick = (add: boolean, value: string) => {
		add
			? setSelection([...selection, value])
			: setSelection(selection.filter((item) => item !== value));

		setValue('mediums', selection);
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

	const getItems = () => {
		return [];
		// TODO: enable when output is available
		// return (aggregates.buckets || [])
		// 	.filter((bucket) => {
		// 		return !query || (query && bucket.key && bucket.key.indexOf(query) >= 0);
		// 	})
		// 	.map((bucket) => {
		// 		const value = bucket.key || '';

		// 		return {
		// 			...bucket,
		// 			checked: selection.indexOf(value) !== -1,
		// 			label: getMediumTranslation(value),
		// 			value,
		// 		};
		// 	});
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

				{/* https://meemoo.atlassian.net/wiki/spaces/HA2/pages/3402891314/Geavanceerde+search+BZT+versie+1?focusedCommentId=3417604098#comment-3417604098 */}
				<p className="u-color-neutral u-text-center u-my-16">
					{'Missing "dcterms_medium"'}
				</p>

				<CheckboxList
					className="u-my-16"
					items={getItems()}
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
