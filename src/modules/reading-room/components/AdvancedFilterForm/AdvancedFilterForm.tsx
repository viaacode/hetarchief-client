import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { AdvancedFilter, MetadataProp, ReadingRoomFilterId } from '@reading-room/types';
import { Icon } from '@shared/components';
import { Operator } from '@shared/types';

import { AdvancedFilterFields } from '../AdvancedFilterFields';

import { ADVANCED_FILTER_FORM_SCHEMA } from './AdvancedFilterForm.const';
import { AdvancedFilterFormProps, AdvancedFilterFormState } from './AdvancedFilterForm.types';

const initialFields = (): AdvancedFilter => ({
	prop: MetadataProp.Everything,
	op: Operator.Contains,
	val: '',
});

const AdvancedFilterForm: FC<AdvancedFilterFormProps> = ({ children, className, values }) => {
	const { t } = useTranslation();
	const { control, getValues, reset } = useForm<AdvancedFilterFormState>({
		defaultValues: {
			advanced: values?.advanced ? values.advanced : [initialFields()],
		},
		resolver: yupResolver(ADVANCED_FILTER_FORM_SCHEMA()),
	});
	const { append, fields, remove, update } = useFieldArray({
		name: ReadingRoomFilterId.Advanced,
		control,
	});

	return (
		<>
			<div className={clsx(className, 'c-advanced-filter-form')}>
				<p className="u-px-20 u-px-32:md u-mt-40 u-mb-32">
					{t(
						'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-form___stel-je-eigen-geavanceerde-filter-samen-aan-de-hand-van-deze-metadata-velden-en-waarden'
					)}
				</p>

				{fields.map(({ id, ...value }, index) => (
					<AdvancedFilterFields
						key={`advanced-filter-${index}`}
						id={id}
						index={index}
						value={value}
						onChange={update}
						onRemove={remove}
					/>
				))}

				<div className="u-p-20 u-p-32:md u-bg-platinum">
					<Button
						className="u-p-0"
						iconStart={<Icon name="plus" />}
						label={t(
							'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-form___nieuwe-stelling'
						)}
						variants="text"
						onClick={() => append(initialFields())}
					/>
				</div>
			</div>

			{children({ values: getValues(), reset })}
		</>
	);
};

export default AdvancedFilterForm;
