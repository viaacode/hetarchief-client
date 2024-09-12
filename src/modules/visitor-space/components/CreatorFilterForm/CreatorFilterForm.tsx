import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { type ChangeEvent, type FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';

import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tText } from '@shared/helpers/translate';
import { SearchFilterId } from '@visitor-space/types';

import {
	CREATOR_FILTER_FORM_QUERY_PARAM_CONFIG,
	CREATOR_FILTER_FORM_SCHEMA,
} from './CreatorFilterForm.const';
import styles from './CreatorFilterForm.module.scss';
import {
	type CreatorFilterFormProps,
	type CreatorFilterFormState,
} from './CreatorFilterForm.types';

const defaultValues: CreatorFilterFormState = {
	creator: '',
};

const CreatorFilterForm: FC<CreatorFilterFormProps> = ({ children, className }) => {
	// State
	const [query] = useQueryParams(CREATOR_FILTER_FORM_QUERY_PARAM_CONFIG);

	const initial = query?.[SearchFilterId.Creator] || '';

	const [form, setForm] = useState<CreatorFilterFormState>({ creator: initial });
	const {
		clearErrors,
		control,
		formState: { errors },
		handleSubmit,
		setValue,
	} = useForm<CreatorFilterFormState>({
		resolver: yupResolver(CREATOR_FILTER_FORM_SCHEMA()),
		defaultValues,
		reValidateMode: 'onChange',
	});

	// Effects

	useEffect(() => {
		setValue('creator', form.creator);
	}, [form, setValue]);

	useEffect(() => {
		if (initial) {
			setForm((oldForm) => ({ ...oldForm, creator: initial }));
		}
	}, [initial]);

	// Events

	const onChangeCreator = (evt: ChangeEvent<HTMLInputElement>) => {
		setForm((oldForm) => ({ ...oldForm, creator: evt.target.value }));
	};

	return (
		<>
			<div
				className={clsx(
					className,
					styles['c-creator-filter-form__input'],
					'u-px-20 u-px-32:md'
				)}
			>
				<FormControl
					className="c-form-control--label-hidden"
					errors={[
						<>
							<RedFormWarning error={errors.creator?.message} />
						</>,
					]}
					id="CreatorFilterForm__creator"
					label={tText(
						'modules/visitor-space/components/creator-filter-form/creator-filter-form___maker'
					)}
				>
					<Controller
						control={control}
						name="creator"
						render={({ field }) => (
							<TextInput
								{...field}
								value={form.creator || defaultValues.creator || ''}
								onChange={onChangeCreator}
								placeholder={tText(
									'modules/visitor-space/components/creator-filter-form/creator-filter-form___naam-van-de-maker'
								)}
							/>
						)}
					/>
				</FormControl>
			</div>

			{children({
				values: form,
				reset: () => {
					setForm(defaultValues);
					clearErrors();
				},
				handleSubmit,
			})}
		</>
	);
};

export default CreatorFilterForm;
