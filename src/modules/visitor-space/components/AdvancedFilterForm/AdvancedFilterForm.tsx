import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useState } from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml } from '@shared/helpers/translate';
import { AdvancedFilterFields } from '../AdvancedFilterFields/AdvancedFilterFields';
import { initialFields } from './AdvancedFilterForm.const';
import styles from './AdvancedFilterForm.module.scss';
import type { AdvancedFilterFormProps, AdvancedFilterFormState } from './AdvancedFilterForm.types';

import { getRandomId } from '@shared/helpers/get-random-id';
import type { AdvancedFilter, IdentityAdvancedFilter } from '@visitor-space/types';
import { omit } from 'lodash-es';
import type { UseFormHandleSubmit } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form/dist/types/form';

export const AdvancedFilterForm: FC<AdvancedFilterFormProps> = ({
	children,
	className,
	disabled,
	values,
}) => {
	const initialFilterValues = values?.advanced ? values.advanced : [initialFields()];
	const [filterValues, setFilterValues] = useState<IdentityAdvancedFilter[]>(
		initialFilterValues.map((value) => ({ ...value, id: getRandomId() }))
	);

	const handleChange = (index: number, newValue: IdentityAdvancedFilter) => {
		const newFilterValues = [...filterValues];
		newFilterValues[index] = newValue;
		setFilterValues(newFilterValues);
	};

	const handleSubmit = ((onValid: SubmitHandler<AdvancedFilterFormState>) => {
		return () => {
			const validFilterValues = filterValues
				.map((value): AdvancedFilter => {
					return omit(value, ['id']);
				})
				.filter((value) => value.prop && value.op && value.val);
			return onValid({
				advanced: validFilterValues,
			});
		};
	}) as UseFormHandleSubmit<AdvancedFilterFormState>;

	const handleReset = () => {
		setFilterValues([
			{
				...initialFields(),
				id: getRandomId(),
			},
		]);
	};

	const handleRemove = (index: number) => {
		const newFilterValues = [...filterValues];
		newFilterValues.splice(index, 1);
		setFilterValues(newFilterValues);
	};

	const handleAppend = () => {
		setFilterValues([
			...filterValues,
			{
				...initialFields(),
				id: getRandomId(),
			},
		]);
	};

	return (
		<>
			<div className={clsx(className, styles.advancedFilterForm, 'u-overflow-auto')}>
				<p className="u-px-32 u-px-20-md u-mt-40 u-mb-32">
					{tHtml(
						'modules/visitor-space/components/forms/advanced-filter-form/advanced-filter-form___stel-je-eigen-geavanceerde-filter-samen-aan-de-hand-van-deze-advanced-filters-velden-en-waarden'
					)}
				</p>

				{!disabled &&
					filterValues.map((filterValue, index) => {
						const key = `advanced-filter-${filterValue.prop}--${filterValue.op}`;
						return (
							<AdvancedFilterFields
								key={key}
								id={filterValue.id}
								index={index}
								filterValue={filterValue}
								onChange={handleChange}
								onRemove={handleRemove}
							/>
						);
					})}

				<div className="u-p-32 u-p-20-md u-bg-platinum">
					<Button
						disabled={disabled}
						className="u-p-0"
						iconStart={<Icon name={IconNamesLight.Plus} />}
						label={tHtml(
							'modules/visitor-space/components/forms/advanced-filter-form/advanced-filter-form___nieuwe-stelling'
						)}
						variants="text"
						onClick={handleAppend}
					/>
				</div>
			</div>

			{children({
				values: {
					advanced: filterValues,
				},
				reset: () => handleReset(),
				handleSubmit,
			})}
		</>
	);
};
