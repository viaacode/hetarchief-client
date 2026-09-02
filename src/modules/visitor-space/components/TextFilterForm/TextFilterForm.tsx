import {
	Button,
	FormControl,
	ReactSelect,
	type SelectOption,
	TextInput,
} from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml, tText } from '@shared/helpers/translate';
import { SEARCH_PAGE_QUERY_PARAM_CONFIG } from '@visitor-space/const';
import {
	type GenericFilterFormProps,
	Operator,
	type TextFilterCondition,
} from '@visitor-space/types';
import { getSelectValue } from '@visitor-space/utils/select';
import clsx from 'clsx';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SingleValue } from 'react-select';
import { useQueryParams } from 'use-query-params';
import styles from './TextFilterForm.module.scss';

const emptyCondition = (): TextFilterCondition => ({ op: Operator.CONTAINS, val: '' });

const getOperatorOptions = (): SelectOption[] => [
	{
		label: tText('modules/visitor-space/components/text-filter-form/text-filter-form___bevat'),
		value: Operator.CONTAINS,
	},
	{
		label: tText('modules/visitor-space/components/text-filter-form/text-filter-form___bevat-niet'),
		value: Operator.CONTAINS_NOT,
	},
];

/**
 * A filter over a free text field: a list of "Bevat" / "Bevat niet" conditions on one field.
 * See the "Text filters" section of the ARC-3806 FA.
 */
export const TextFilterForm: FC<GenericFilterFormProps> = ({
	children,
	className,
	filter,
	disabled,
}) => {
	const [query] = useQueryParams(SEARCH_PAGE_QUERY_PARAM_CONFIG);

	const appliedConditions: TextFilterCondition[] = query[filter.id] || [];
	// The user always starts with one empty condition
	const [conditions, setConditions] = useState<TextFilterCondition[]>(() =>
		appliedConditions.length > 0 ? appliedConditions : [emptyCondition()]
	);

	const { reset, handleSubmit } = useForm({ defaultValues: {} });
	const operatorOptions = getOperatorOptions();

	const changeCondition = (index: number, change: Partial<TextFilterCondition>): void => {
		setConditions(
			conditions.map((condition, i) => (i === index ? { ...condition, ...change } : condition))
		);
	};

	/** Clearing the only condition empties its text field rather than removing the row. */
	const clearCondition = (index: number): void => {
		if (conditions.length === 1) {
			setConditions([emptyCondition()]);
			return;
		}
		setConditions(conditions.filter((_condition, i) => i !== index));
	};

	return (
		<>
			<div className={clsx(className, styles['c-text-filter-form'])}>
				<p className={styles['c-text-filter-form__description']}>
					{tHtml(
						'modules/visitor-space/components/text-filter-form/text-filter-form___combineer-verschillende-voorwaarden-om-jouw-exacte-zoekopdracht-waar-te-maken'
					)}
				</p>

				{conditions.map((condition, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: a condition has no id of its own
					<div className={styles['c-text-filter-form__condition']} key={`condition-${index}`}>
						{index > 0 && (
							<span className={styles['c-text-filter-form__separator']}>
								{tText('modules/visitor-space/components/text-filter-form/text-filter-form___of')}
							</span>
						)}

						<FormControl
							className={clsx(
								'c-form-control--label-hidden',
								styles['c-text-filter-form__operator']
							)}
							id={`text-filter-form-${filter.id}-operator-${index}`}
							label={tHtml(
								'modules/visitor-space/components/text-filter-form/text-filter-form___operator'
							)}
						>
							<ReactSelect
								components={{ IndicatorSeparator: () => null }}
								inputId={`text-filter-form-${filter.id}-operator-${index}`}
								isDisabled={disabled}
								onChange={(newValue) =>
									changeCondition(index, {
										op: (newValue as SingleValue<SelectOption>)?.value as Operator,
									})
								}
								options={operatorOptions}
								value={getSelectValue(operatorOptions, condition.op)}
							/>
						</FormControl>

						<div className={styles['c-text-filter-form__value']}>
							<TextInput
								id={`text-filter-form-${filter.id}-value-${index}`}
								disabled={disabled}
								value={condition.val}
								onChange={(e) => changeCondition(index, { val: e.target.value })}
								ariaLabel={tText(
									'modules/visitor-space/components/text-filter-form/text-filter-form___zoek-field-name-input-aria-label',
									{ fieldName: filter.label }
								)}
							/>
							<Button
								disabled={disabled}
								icon={<Icon name={IconNamesLight.Trash} aria-hidden />}
								ariaLabel={tText(
									'modules/visitor-space/components/text-filter-form/text-filter-form___voorwaarde-wissen'
								)}
								variants="black"
								onClick={() => clearCondition(index)}
							/>
						</div>
					</div>
				))}

				<Button
					className={styles['c-text-filter-form__add']}
					disabled={disabled}
					iconStart={<Icon name={IconNamesLight.Plus} aria-hidden />}
					label={tText(
						'modules/visitor-space/components/text-filter-form/text-filter-form___voeg-voorwaarde-toe'
					)}
					variants="text"
					onClick={() => setConditions([...conditions, emptyCondition()])}
				/>
			</div>

			{children({
				values: { [filter.id]: conditions.filter((condition) => !!condition.val.trim()) },
				reset: () => {
					reset();
					setConditions([emptyCondition()]);
				},
				handleSubmit,
			})}
		</>
	);
};
