import { FormControl, type TagInfo, TagsInput, keysEnter, onKey } from '@meemoo/react-components';
import { TAGS_INPUT_COMPONENTS } from '@shared/components/TagsInput';
import { tHtml } from '@shared/helpers/translate';
import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { initialFilterValues } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm.const';
import FilterFormButtons from '@visitor-space/components/FilterMenu/FilterFormButtons/FilterFormButtons';
import { AdvancedFilterArrayParam } from '@visitor-space/const/advanced-filter-array-param';
import type { DefaultFilterFormProps, FilterValue } from '@visitor-space/types';
import clsx from 'clsx';
import { compact } from 'lodash-es';
import { type FC, type KeyboardEvent, useMemo, useState } from 'react';
import type { ActionMeta, InputActionMeta, MultiValue, SingleValue } from 'react-select';
import { useQueryParam } from 'use-query-params';

type multi = MultiValue<TagInfo>;

enum KeywordField {
	keywords = 'KeywordsFilterForm__keywords',
}

const KeywordsFilterForm: FC<DefaultFilterFormProps> = ({
	className,
	id,
	initialValues,
	onSubmit,
	onReset,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(
		IeObjectsSearchFilterField.KEYWORD,
		AdvancedFilterArrayParam
	);
	const [values, setValues] = useState<FilterValue[]>(
		initialFilterValues(id, initialValues, initialValueFromQueryParams)
	);
	const [input, setInput] = useState<string | undefined>(undefined);

	// Computed

	const tags: TagInfo[] = compact(values[0]?.multiValue)?.map((value) => ({
		label: value,
		value,
	}));

	// Methods

	const saveInput = () => {
		if (input && input.length > 0) {
			setValues((oldValues): FilterValue[] => [
				{
					...oldValues[0],
					multiValue: [...(oldValues[0]?.multiValue || []), input.toLowerCase()],
				},
			]);

			setInput('');
		}
	};

	// Events

	const onTagsChange = (newValue: multi | SingleValue<TagInfo>, meta: ActionMeta<TagInfo>) => {
		const mapValues = () => {
			if (newValue && (newValue as multi).length >= 0) {
				const cast = newValue as multi;

				setValues((oldValues): FilterValue[] => [
					{
						...oldValues[0],
						multiValue: cast.map((item) => item.value.toString()),
					},
				]);
			}
		};

		switch (meta.action) {
			case 'remove-value':
			case 'pop-value':
				mapValues();
				break;
			case 'clear':
				mapValues();
				setInput('');
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

	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => onKey(e, [...keysEnter], saveInput);

	const handleSubmit = () => {
		onSubmit(values);
	};

	const handleReset = () => {
		setValues(initialFilterValues(id));
		onReset();
	};

	// Must be inside component otherwise we get this error:
	//	index.js:456 ReferenceError: Cannot access '$r' before initialization
	//     at Object.TAGS_INPUT_COMPONENTS (_app-adc1b2d2d2ee133a.js:1:550587)
	//     at Object.58297 (KeywordsFilterForm.tsx:24:5)
	//     at t (bootstrap:21:33)
	//     at Object.43133 (_app-adc1b2d2d2ee133a.js:1:516231)
	//     at t (bootstrap:21:33)
	const components = useMemo(() => {
		return {
			...TAGS_INPUT_COMPONENTS,
			DropdownIndicator: () => <div className="u-pr-8" />,
		};
	}, []);

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32-md')}>
				<div className="u-mb-32">
					<FormControl
						className="u-mb-24 c-form-control--label-hidden"
						id={KeywordField.keywords}
						label={tHtml(
							'modules/visitor-space/components/keywords-filter-form/keywords-filter-form___waardes'
						)}
					>
						<TagsInput
							components={components}
							inputId={KeywordField.keywords}
							inputValue={input}
							isClearable={true}
							isMulti={true} // always `multi`
							menuIsOpen={false}
							onBlur={saveInput}
							onChange={onTagsChange}
							onInputChange={onInputChange}
							onKeyDown={onKeyDown}
							value={tags}
						/>
					</FormControl>
				</div>
			</div>

			<FilterFormButtons onSubmit={handleSubmit} onReset={handleReset} />
		</>
	);
};

export default KeywordsFilterForm;
