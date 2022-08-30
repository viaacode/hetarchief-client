import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, keysEnter, onKey, TagInfo, TagsInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC, KeyboardEvent, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActionMeta, InputActionMeta, MultiValue, SingleValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

import { TAGS_INPUT_COMPONENTS } from '@shared/components';

import {
	KEYWORDS_FILTER_FORM_QUERY_PARAM_CONFIG,
	KEYWORDS_FILTER_FORM_SCHEMA,
} from './KeywordsFilterForm.const';
import { KeywordsFilterFormProps, KeywordsFilterFormState } from './KeywordsFilterForm.types';

type multi = MultiValue<TagInfo>;

const labelKeys: Record<keyof KeywordsFilterFormState, string> = {
	values: 'KeywordsFilterForm__values',
};

const defaultValues: KeywordsFilterFormState = {
	values: [],
};

const KeywordsFilterForm: FC<KeywordsFilterFormProps> = ({ children, className }) => {
	const { t } = useTranslation();
	const [query] = useQueryParams(KEYWORDS_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [input, setInput] = useState<string | undefined>(undefined);

	const [form, setForm] = useState<KeywordsFilterFormState>({
		values: (query.keywords?.filter((k) => k !== null) as string[]) || [],
	});
	const {
		control,
		reset,
		formState: { errors },
		handleSubmit,
	} = useForm<KeywordsFilterFormState>({
		resolver: yupResolver(KEYWORDS_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	// Computed

	const getTags = form.values?.map((value) => ({
		label: value,
		value,
	}));

	// Methods

	const saveInput = () => {
		if (input && input.length > 0) {
			setForm((f) => ({
				values: [...(f.values || []), input.toLowerCase()],
			}));

			setInput('');
		}
	};

	// Events

	const onTagsChange = (value: multi | SingleValue<TagInfo>, meta: ActionMeta<TagInfo>) => {
		const mapValues = () => {
			if (value && (value as multi).length >= 0) {
				const cast = value as multi;

				setForm({
					values: cast.map((item) => item.value.toString()),
				});
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
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<div className="u-mb-32">
					<FormControl
						className="u-mb-24 c-form-control--label-hidden"
						errors={(errors.values || []).map((value) => value.message)}
						id={labelKeys.values}
						label={t(
							'modules/visitor-space/components/keywords-filter-form/keywords-filter-form___waardes'
						)}
					>
						<Controller
							name="values"
							control={control}
							render={() => (
								<TagsInput
									components={components}
									inputId={labelKeys.values}
									inputValue={input}
									isClearable={true}
									isMulti={true} // always `multi`
									menuIsOpen={false}
									onBlur={saveInput}
									onChange={onTagsChange}
									onInputChange={onInputChange}
									onKeyDown={onKeyDown}
									value={getTags}
								/>
							)}
						/>
					</FormControl>
				</div>
			</div>

			{children({
				values: form,
				reset: () => {
					reset();
					setForm(defaultValues);
				},
				handleSubmit,
			})}
		</>
	);
};

export default KeywordsFilterForm;
