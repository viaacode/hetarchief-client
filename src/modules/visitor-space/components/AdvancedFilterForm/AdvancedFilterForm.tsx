import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useState } from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml } from '@shared/helpers/translate';

import FilterFormButtons from '@visitor-space/components/FilterMenu/FilterFormButtons/FilterFormButtons';
import type { FilterValue } from '../../types';
import { AdvancedFilterFields } from '../AdvancedFilterFields/AdvancedFilterFields';
import { initialFilterValue } from './AdvancedFilterForm.const';
import styles from './AdvancedFilterForm.module.scss';
import type { AdvancedFilterFormProps } from './AdvancedFilterForm.types';

export const AdvancedFilterForm: FC<AdvancedFilterFormProps> = ({
	className,
	disabled = false,
	onSubmit,
	onReset,
	initialValues,
}) => {
	const [values, setValues] = useState<FilterValue[]>(initialValues || [initialFilterValue()]);

	const handleChange = (index: number, value: FilterValue) => {
		const newValues = [...values];
		newValues[index] = value;
		setValues(newValues);
	};

	const handleRemove = (index: number) => {
		const newValues = [...values];
		newValues.splice(index, 1);
		setValues(newValues);
	};

	const appendValue = (value: FilterValue) => {
		setValues([...values, value]);
	};

	const handleSubmit = async () => {
		onSubmit(values);
	};

	const handleReset = () => {
		setValues([initialFilterValue()]);
		onReset();
	};

	return (
		<>
			<div className={clsx(className, styles.advancedFilterForm, 'u-overflow-auto')}>
				<p className="u-px-20 u-px-32-md u-mt-40 u-mb-32">
					{tHtml(
						'modules/visitor-space/components/forms/advanced-filter-form/advanced-filter-form___stel-je-eigen-geavanceerde-filter-samen-aan-de-hand-van-deze-advanced-filters-velden-en-waarden'
					)}
				</p>

				{!disabled &&
					values.map((value, index) => (
						<AdvancedFilterFields
							key={`advanced-filter-${value.field}--${value.operator}--${value.val}`}
							id={`advanced-filter-${value.field}--${value.operator}--${value.val}`}
							index={index}
							value={value}
							onChange={handleChange}
							onRemove={handleRemove}
						/>
					))}

				<div className="u-p-20 u-p-32-md u-bg-platinum">
					<Button
						disabled={disabled}
						className="u-p-0"
						iconStart={<Icon name={IconNamesLight.Plus} />}
						label={tHtml(
							'modules/visitor-space/components/forms/advanced-filter-form/advanced-filter-form___nieuwe-stelling'
						)}
						variants="text"
						onClick={() => appendValue(initialFilterValue())}
					/>
				</div>
			</div>

			<FilterFormButtons onSubmit={handleSubmit} onReset={handleReset} />
		</>
	);
};
