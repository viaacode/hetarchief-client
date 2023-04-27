import { yupResolver } from '@hookform/resolvers/yup';
import { keysEnter, onKey, TagInfo, TagsInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { compact } from 'lodash-es';
import { FC, KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActionMeta, InputActionMeta, MultiValue, SingleValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

import { TAGS_INPUT_COMPONENTS } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import {
	CREATOR_FILTER_FORM_QUERY_PARAM_CONFIG,
	CREATOR_FILTER_FORM_SCHEMA,
} from './CreatorFilterForm.const';
import styles from './CreatorFilterForm.module.scss';
import { CreatorFilterFormProps, CreatorFilterFormState } from './CreatorFilterForm.types';

type multi = MultiValue<TagInfo>;

const defaultValues = {
	creators: [],
};

const CreatorFilterForm: FC<CreatorFilterFormProps> = ({ children, className }) => {
	const { tText } = useTranslation();

	// State
	const [query] = useQueryParams(CREATOR_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [creatorValues, setCreatorValues] = useState<string[]>(compact(query.creator ?? []));
	const [input, setInput] = useState<string>('');

	// This will probably be re-enabled during fase 3 when there are better search options in the elasticsearch mapping
	// const [currentSearchFilters] = useQueryParams(VISITOR_SPACE_QUERY_PARAM_CONFIG);
	// const [search, setSearch] = useState<string>('');
	// const [selection, setSelection] = useState<string[]>(() => compact(query.creator || []));
	// const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);

	const { setValue, reset, handleSubmit } = useForm<CreatorFilterFormState>({
		resolver: yupResolver(CREATOR_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	// Computed

	const creatorValueTags = creatorValues?.map((value) => ({
		label: value,
		value,
	}));

	// This will probably be re-enabled during fase 3 when there are better search options in the elasticsearch mapping
	// const filters: IeObjectsSearchFilter[] = [
	// 	...mapFiltersToElastic(currentSearchFilters),
	// 	...mapRefineFilterToElastic([
	// 		{
	// 			field: IeObjectsSearchFilterField.CREATOR,
	// 			value: search,
	// 		},
	// 	]),
	// ];

	// const initialAggregates = useSelector(selectIeObjectsFilterOptions);
	// const { data: aggregates } = useGetIeObjectsAggregatesByField(
	// 	VisitorSpaceFilterId.Creator,
	// 	filters,
	// 	isSearchEnabled
	// );

	// const buckets = useMemo(() => {
	// 	// TODO: add sort
	// 	const initial = initialAggregates?.schema_creator?.buckets;
	// 	const result = aggregates || initial || [];
	//
	// 	return result;
	// }, [aggregates, initialAggregates]);

	// Effects
	useEffect(() => {
		setValue('creators', compact(creatorValues));
	}, [creatorValues, setValue]);

	// Events

	const onTagsChange = (value: multi | SingleValue<TagInfo>, meta: ActionMeta<TagInfo>) => {
		switch (meta.action) {
			case 'remove-value':
			case 'pop-value':
				if (value && (value as multi).length >= 0) {
					const cast = value as multi;
					setCreatorValues(cast.map((item) => item.value.toString()));
				}
				break;

			case 'clear':
				setCreatorValues([]);
				break;

			default:
				break;
		}
	};

	const onInputChange = (value: string, meta: InputActionMeta) => {
		switch (meta.action) {
			case 'input-change':
				setInput(value);
				break;

			default:
				break;
		}
	};

	const saveInput = () => {
		if (input && input.length > 0) {
			setCreatorValues([...(creatorValues || []), input.toLowerCase()]);
			setInput('');
		}
	};

	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => onKey(e, [...keysEnter], saveInput);

	const components = useMemo(() => {
		return {
			...TAGS_INPUT_COMPONENTS,
			DropdownIndicator: () => null,
		};
	}, []);

	return (
		<>
			<div
				className={clsx(
					className,
					styles['c-creator-filter-form__input'],
					'u-px-20 u-px-32:md'
				)}
			>
				<TagsInput
					components={components}
					inputId={'creator-filter-form'}
					inputValue={input}
					isClearable
					isMulti // always `multi`
					allowCreate
					menuIsOpen={false}
					onChange={onTagsChange}
					onInputChange={onInputChange}
					onKeyDown={onKeyDown}
					value={creatorValueTags}
					placeholder={tText('Naam van de maker')}
				/>

				{/* This will probably be re-enabled during fase 3 when there are better search options in the elasticsearch mapping */}
				{/*<SearchBar*/}
				{/*	id={`${visitorSpaceLabelKeys.filters.title}--${VisitorSpaceFilterId.Creator}`}*/}
				{/*	value={search}*/}
				{/*	variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}*/}
				{/*	placeholder={tText(*/}
				{/*		'modules/visitor-space/components/creator-filter-form/creator-filter-form___zoek'*/}
				{/*	)}*/}
				{/*	onChange={setSearch}*/}
				{/*	onSearch={noop}*/}
				{/*/>*/}

				{/*<div className="u-my-32">*/}
				{/*	{buckets.length === 0 && (*/}
				{/*		<p className="u-color-neutral u-text-center">*/}
				{/*			{tHtml(*/}
				{/*				'modules/visitor-space/components/creator-filter-form/creator-filter-form___geen-makers-gevonden'*/}
				{/*			)}*/}
				{/*		</p>*/}
				{/*	)}*/}

				{/*	<CheckboxList*/}
				{/*		items={buckets.map((bucket) => ({*/}
				{/*			...bucket,*/}
				{/*			value: bucket.key,*/}
				{/*			label: bucket.key,*/}
				{/*			checked: selection.includes(bucket.key),*/}
				{/*		}))}*/}
				{/*		onItemClick={(checked, value) => {*/}
				{/*			onItemClick(!checked, value as string);*/}
				{/*		}}*/}
				{/*	/>*/}
				{/*</div>*/}
			</div>

			{children({
				values: { creators: compact([...creatorValues, input]) },
				reset: () => {
					reset();
					setCreatorValues([]);
					setInput('');
				},
				handleSubmit,
			})}
		</>
	);
};

export default CreatorFilterForm;
