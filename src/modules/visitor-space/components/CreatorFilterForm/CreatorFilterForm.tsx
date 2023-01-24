import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { compact, without } from 'lodash-es';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { SearchBar } from '@shared/components';
import { CheckboxList } from '@shared/components/CheckboxList';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { selectMediaFilterOptions } from '@shared/store/media';
import { visitorSpaceLabelKeys } from '@visitor-space/const';
import { VisitorSpaceFilterId } from '@visitor-space/types';

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
	const [search, setSearch] = useState<string>('');
	const [shouldReset, setShouldReset] = useState<boolean>(false);
	const [selection, setSelection] = useState<string[]>(() => compact(query.creator || []));

	const { setValue, reset, handleSubmit } = useForm<CreatorFilterFormState>({
		resolver: yupResolver(CREATOR_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const buckets = (useSelector(selectMediaFilterOptions)?.schema_creator.buckets || []).filter(
		(bucket) => bucket.key.toLowerCase().includes(search.toLowerCase())
	);

	// Effects

	useEffect(() => {
		setValue('creators', selection);
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
					id={`${visitorSpaceLabelKeys.filters.title}--${VisitorSpaceFilterId.Creator}`}
					default={search}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={tText(
						'modules/visitor-space/components/creator-filter-form/creator-filter-form___zoek'
					)}
					onSearch={(value) => setSearch(value || '')}
					shouldReset={shouldReset}
					onResetFinished={() => setShouldReset(false)}
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
					setShouldReset(true);
				},
				handleSubmit,
			})}
		</>
	);
};

export default CreatorFilterForm;
