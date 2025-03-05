import { FormControl, ReactSelect, type SelectOption } from '@meemoo/react-components';
import clsx from 'clsx';
import { type ChangeEvent, type FC, useMemo, useState } from 'react';
import type { SingleValue } from 'react-select';
import { useQueryParam } from 'use-query-params';

import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tHtml } from '@shared/helpers/translate';

import { type DefaultFilterFormProps, type FilterValue, Operator } from '../../types';
import { getSelectValue } from '../../utils/select';
import { DurationInput } from '../DurationInput';
import { defaultValue } from '../DurationInput/DurationInput';
import { DurationRangeInput } from '../DurationRangeInput';

import { validateForm } from '@shared/helpers/validate-form';
import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { initialFilterValues } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm.const';
import { DURATION_FILTER_FORM_SCHEMA } from '@visitor-space/components/DurationFilterForm/DurationFilterForm.const';
import FilterFormButtons from '@visitor-space/components/FilterMenu/FilterFormButtons/FilterFormButtons';
import {
	AdvancedFilterArrayParam,
	getOperators,
} from '@visitor-space/const/advanced-filter-array-param';

enum DurationField {
	duration = 'DurationFilterForm__duration',
	operator = 'DurationFilterForm__operator',
}

const DurationFilterForm: FC<DefaultFilterFormProps> = ({
	id,
	className,
	disabled,
	initialValues,
	onSubmit,
	onReset,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(
		IeObjectsSearchFilterField.DURATION,
		AdvancedFilterArrayParam
	);
	const [values, setValues] = useState<FilterValue[]>(
		initialFilterValues(id, initialValues, initialValueFromQueryParams, Operator.GTE)
	);
	const [formErrors, setFormErrors] = useState<Record<DurationField, string> | null>();

	const operators = useMemo(() => getOperators(IeObjectsSearchFilterField.DURATION), []);

	// Events

	const onChangeDuration = (e: ChangeEvent<HTMLInputElement>) => {
		setValues((oldValues): FilterValue[] => [
			{
				...oldValues[0],
				multiValue: [e.target.value],
			},
		]);
	};

	const handleSubmit = async () => {
		const errors = await validateForm(values[0], DURATION_FILTER_FORM_SCHEMA());
		setFormErrors(errors);
		if (!errors) {
			onSubmit(values);
		}
	};

	const handleReset = () => {
		setValues(initialFilterValues(id, undefined, undefined, Operator.GTE));
		onReset();
	};

	return (
		<>
			<div className={clsx(className)}>
				<FormControl
					className="u-mb-24 c-form-control--label-hidden"
					errors={[
						<RedFormWarning
							error={formErrors?.[DurationField.operator]}
							key="form-error--operator"
						/>,
					]}
					id={DurationField.operator}
					label={tHtml(
						'modules/visitor-space/components/duration-filter-form/duration-filter-form___operator'
					)}
				>
					<div className="u-px-20 u-px-32-md">
						<ReactSelect
							isDisabled={disabled}
							components={{ IndicatorSeparator: () => null }}
							inputId={DurationField.operator}
							onChange={(newValue) => {
								const selectedOperator = (newValue as SingleValue<SelectOption>)?.value as Operator;

								if (selectedOperator !== values[0]?.operator) {
									setValues([
										{
											...values[0],
											operator: selectedOperator,
										},
									]);
								}
							}}
							options={operators}
							value={getSelectValue(operators, values[0]?.operator)}
						/>
					</div>
				</FormControl>

				<FormControl
					className="c-form-control--label-hidden"
					errors={[
						<RedFormWarning
							error={[
								<RedFormWarning
									error={formErrors?.[DurationField.duration]}
									key="form-error--duration"
								/>,
							]}
							key="form-error--duration"
						/>,
					]}
					id={DurationField.duration}
					label={tHtml(
						'modules/visitor-space/components/duration-filter-form/duration-filter-form___waarde'
					)}
				>
					<div className="u-py-32 u-px-20 u-px-32-md u-bg-platinum">
						{values[0]?.operator === Operator.BETWEEN ? (
							<DurationRangeInput
								value={values[0]?.multiValue?.[0] || [defaultValue, defaultValue]}
								onChange={onChangeDuration}
								placeholder={values[0]?.multiValue?.[0]}
							/>
						) : (
							<DurationInput
								value={values[0]?.multiValue?.[0] || defaultValue}
								onChange={onChangeDuration}
								placeholder={values[0]?.multiValue?.[0]}
							/>
						)}
					</div>
				</FormControl>
			</div>

			<FilterFormButtons onSubmit={handleSubmit} onReset={handleReset} />
		</>
	);
};

export default DurationFilterForm;
