import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { Icon, IconNamesLight } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import { SearchFilterId } from '../../types';
import { AdvancedFilterFields } from '../AdvancedFilterFields';

import { ADVANCED_FILTER_FORM_SCHEMA, initialFields } from './AdvancedFilterForm.const';
import styles from './AdvancedFilterForm.module.scss';
import { AdvancedFilterFormProps, AdvancedFilterFormState } from './AdvancedFilterForm.types';

const AdvancedFilterForm: FC<AdvancedFilterFormProps> = ({
	children,
	className,
	disabled,
	values,
}) => {
	const { tHtml } = useTranslation();
	const { control, getValues, setValue, handleSubmit } = useForm<AdvancedFilterFormState>({
		defaultValues: {
			advanced: values?.advanced ? values.advanced : [initialFields()],
		},
		resolver: yupResolver(ADVANCED_FILTER_FORM_SCHEMA()),
	});
	const { append, fields, remove, update } = useFieldArray({
		name: SearchFilterId.Advanced,
		control,
	});

	const resetFields = () => {
		setValue('advanced', [initialFields()]);
		update(0, {
			prop: undefined,
			op: undefined,
			val: undefined,
		});
	};

	return (
		<>
			<div className={clsx(className, styles['advancedFilterForm'], 'u-overflow-auto')}>
				<p className="u-px-20 u-px-32:md u-mt-40 u-mb-32">
					{tHtml(
						'modules/visitor-space/components/forms/advanced-filter-form/advanced-filter-form___stel-je-eigen-geavanceerde-filter-samen-aan-de-hand-van-deze-metadata-velden-en-waarden'
					)}
				</p>

				{!disabled &&
					fields.map(({ id, ...value }, index) => (
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
						disabled={disabled}
						className="u-p-0"
						iconStart={<Icon name={IconNamesLight.Plus} />}
						label={tHtml(
							'modules/visitor-space/components/forms/advanced-filter-form/advanced-filter-form___nieuwe-stelling'
						)}
						variants="text"
						onClick={() => append(initialFields())}
					/>
				</div>
			</div>

			{children({
				values: getValues(),
				reset: () => resetFields(),
				handleSubmit,
			})}
		</>
	);
};

export default AdvancedFilterForm;
