import { yupResolver } from '@hookform/resolvers/yup';
import {
	FormControl,
	keysEnter,
	keysSpacebar,
	onKey,
	TagInfo,
	TagsInput,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, KeyboardEvent, useState } from 'react';
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

const components = {
	...TAGS_INPUT_COMPONENTS,
	DropdownIndicator: () => <div className="u-pr-8" />,
};

const KeywordsFilterForm: FC<KeywordsFilterFormProps> = ({ children, className }) => {
	const [query] = useQueryParams(KEYWORDS_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [input, setInput] = useState<string | undefined>(undefined);

	const [form, setForm] = useState<KeywordsFilterFormState>({
		values: (query.keywords?.filter((k) => k !== null) as string[]) || [],
	});
	const {
		control,
		reset,
		formState: { errors },
	} = useForm<KeywordsFilterFormState>({
		resolver: yupResolver(KEYWORDS_FILTER_FORM_SCHEMA()),
	});

	// Computed

	const getTags = form.values?.map((value) => ({
		label: value,
		value,
	}));

	// Events

	const onTagsChange = (value: multi | SingleValue<TagInfo>, meta: ActionMeta<TagInfo>) => {
		let cast;
		switch (meta.action) {
			case 'remove-value':
			case 'pop-value':
			case 'clear':
				if (value && (value as multi).length >= 0) {
					cast = value as multi;

					setForm({
						values: cast.map((item) => item.value.toString()),
					});
				}
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

	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (input) {
			onKey(e, [...keysEnter, ...keysSpacebar], () => {
				setForm({
					values: [...(form.values || []), input.toLowerCase()],
				});

				setInput('');
			});
		}
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<div className="u-mb-32">
					<FormControl
						className="u-mb-24"
						errors={(errors.values || []).map((value) => value.message)}
					>
						<Controller
							name="values"
							control={control}
							render={() => (
								<TagsInput
									menuIsOpen={false}
									components={components}
									onChange={onTagsChange}
									onInputChange={onInputChange}
									onKeyDown={onKeyDown}
									isClearable={true}
									isMulti={true} // always `multi`
									value={getTags}
									inputValue={input}
								/>
							)}
						/>
					</FormControl>
				</div>
			</div>

			{children({ values: form, reset })}
		</>
	);
};

export default KeywordsFilterForm;
