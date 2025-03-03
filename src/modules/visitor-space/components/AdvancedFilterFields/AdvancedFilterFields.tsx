import {
	Button,
	FormControl,
	ReactSelect,
	type ReactSelectProps,
	type SelectOption,
	TextInput,
	type TextInputProps,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { parseISO } from 'date-fns';
import React, { type FC } from 'react';
import type { SingleValue } from 'react-select';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { SEPARATOR } from '@shared/const';
import { tHtml, tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import type { AdvancedFilterFieldsProps } from '@visitor-space/components/AdvancedFilterFields/AdvancedFilterFields.types';
import AutocompleteFieldInput, {
	type AutocompleteFieldInputProps,
} from '@visitor-space/components/AutocompleteFieldInput/AutocompleteFieldInput';
import { DateInput } from '@visitor-space/components/DateInput';
import type { DateInputProps } from '@visitor-space/components/DateInput/DateInput';
import { DateRangeInput } from '@visitor-space/components/DateRangeInput';
import type { DateRangeInputProps } from '@visitor-space/components/DateRangeInput/DateRangeInput';
import { DurationRangeInput } from '@visitor-space/components/DurationRangeInput';
import { GenreSelect } from '@visitor-space/components/GenreSelect';
import {
	LANGUAGES,
	type LanguageCode,
} from '@visitor-space/components/LanguageFilterForm/languages';
import { LanguageSelect } from '@visitor-space/components/LanguageSelect/LanguageSelect';
import { MediaTypeSelect } from '@visitor-space/components/MediaTypeSelect';
import { MediumSelect } from '@visitor-space/components/MediumSelect/MediumSelect';
import { ObjectTypeSelect } from '@visitor-space/components/ObjectTypeSelect';
import type {
	FilterConfig,
	FilterInputComponentProps,
} from '@visitor-space/const/advanced-filters.consts';

import type { FilterValue, Operator, SearchFilterId } from '../../types';
import { getSelectValue } from '../../utils/select';
import DurationInput, { defaultValue } from '../DurationInput/DurationInput';

import styles from './AdvancedFilterFields.module.scss';

import {
	getAdvancedProperties,
	getFilterConfig,
	getOperators,
} from 'modules/visitor-space/utils/advanced-filters';

const labelKeys = {
	prefix: 'AdvancedFilterFields',
	property: 'AdvancedFilterFields__field',
	operator: 'AdvancedFilterFields__operator',
	value: 'AdvancedFilterFields__value',
};

export const AdvancedFilterFields: FC<AdvancedFilterFieldsProps> = ({
	index,
	value,
	onChange,
	onRemove,
}) => {
	const locale = useLocale();

	// Computed

	const operators = getOperators(value.prop as SearchFilterId);
	const operator = value.op || operators?.[0]?.value || null;

	// Events

	const onFieldChange = (data: Partial<FilterValue>) => {
		onChange(index, { ...value, ...data });
	};

	// Render

	const renderTextField = (
		Component: FC<TextInputProps>,
		textValue?: string,
		props?: TextInputProps
	) => (
		<Component
			{...props}
			className={clsx(
				styles['c-advanced-filter-fields__dynamic-field'],
				styles['c-advanced-filter-fields__dynamic-field--text']
			)}
			value={textValue}
			onChange={(e) =>
				onFieldChange({
					val: e.target.value,
				})
			}
		/>
	);

	const renderField = (config?: FilterInputComponentProps) => {
		const filterConfig: FilterConfig | null = operator
			? getFilterConfig(value.prop as SearchFilterId, operator as Operator)
			: null;
		if (!filterConfig) {
			console.error('Unknown filter config', value.prop, operator);
			return null;
		}

		const props: FilterInputComponentProps = {
			...(filterConfig?.inputComponentProps || {}),
			...config,
		} as FilterInputComponentProps;

		switch (filterConfig.inputComponent) {
			case TextInput: {
				const TextInputComponent = filterConfig.inputComponent as FC<TextInputProps>;
				const textInputComponentProps = (filterConfig.inputComponentProps || {}) as TextInputProps;
				return renderTextField(TextInputComponent, value.val, {
					...textInputComponentProps,
					...(props as TextInputProps),
				});
			}

			case DateRangeInput: {
				const split = ((value.val || '') as string).split(SEPARATOR, 2);

				const from: Date = split[0] ? parseISO(split[0]) : new Date();
				const to: Date = split[1] ? parseISO(split[1]) : new Date();

				const DateRangeInput = filterConfig.inputComponent as FC<DateRangeInputProps>;
				const dateRangeInputProps = filterConfig.inputComponentProps as DateRangeInputProps;
				return (
					<DateRangeInput
						{...dateRangeInputProps}
						className={clsx(
							styles['c-advanced-filter-fields__dynamic-field'],
							styles['c-advanced-filter-fields__dynamic-field--select']
						)}
						from={from}
						to={to}
						onChange={(newFromDate: Date | undefined, newToDate: Date | undefined) =>
							onFieldChange({
								val:
									`${newFromDate?.toISOString()}${SEPARATOR}${newToDate?.toISOString()}` ??
									undefined,
							})
						}
					/>
				);
			}

			case DurationInput: {
				const selectedDuration = value.val || defaultValue; // Ensure initial value is hh:mm:ss
				const TextInputComponent = filterConfig.inputComponent as FC<TextInputProps>;
				const textInputComponentProps = (filterConfig.inputComponentProps || {}) as TextInputProps;

				return renderTextField(TextInputComponent, selectedDuration, {
					...textInputComponentProps,
					...(props as TextInputProps),
				});
			}

			case DurationRangeInput: {
				const selectedDurationRange = value.val || `${defaultValue}${SEPARATOR}${defaultValue}`; // Ensure initial value is hh:mm:ss for both fields
				const TextInputComponent = filterConfig.inputComponent as FC<TextInputProps>;
				const textInputComponentProps = (filterConfig.inputComponentProps || {}) as TextInputProps;

				return renderTextField(TextInputComponent, selectedDurationRange, {
					...textInputComponentProps,
					...(props as TextInputProps),
				});
			}

			case ReactSelect:
			case MediaTypeSelect:
			case GenreSelect:
			case MediumSelect:
			case ObjectTypeSelect: {
				const SelectComponent = filterConfig.inputComponent as FC<ReactSelectProps>;
				const selectComponentProps = filterConfig.inputComponentProps as ReactSelectProps;
				const selectedOption =
					getSelectValue(
						((props as ReactSelectProps).options || []) as SelectOption[],
						value.val
					) || value.val
						? { label: value.val as string, value: value.val as string }
						: undefined;

				return (
					<SelectComponent
						{...(selectComponentProps || {})}
						{...(props as ReactSelectProps)}
						className={clsx(
							styles['c-advanced-filter-fields__dynamic-field'],
							styles['c-advanced-filter-fields__dynamic-field--select']
						)}
						value={selectedOption}
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						onChange={(e: any) =>
							onFieldChange({
								val: (e as SingleValue<SelectOption>)?.value ?? undefined,
							})
						}
					/>
				);
			}

			// Separate case, since we also need to translate the selected value from nl => Nederlands
			case LanguageSelect: {
				const selectComponentProps = filterConfig.inputComponentProps as ReactSelectProps;
				const selectedOption =
					getSelectValue(
						((props as ReactSelectProps).options || []) as SelectOption[],
						value.val
					) || value.val
						? {
								label: LANGUAGES[locale][value.val as LanguageCode],
								value: value.val as string,
							}
						: undefined;

				return (
					<LanguageSelect
						{...(selectComponentProps || {})}
						{...(props as ReactSelectProps)}
						className={clsx(
							styles['c-advanced-filter-fields__dynamic-field'],
							styles['c-advanced-filter-fields__dynamic-field--select']
						)}
						value={selectedOption}
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						onChange={(e: any) =>
							onFieldChange({
								val: (e as SingleValue<SelectOption>)?.value ?? undefined,
							})
						}
					/>
				);
			}

			case DateInput: {
				const DateInputComponent = filterConfig.inputComponent as FC<DateInputProps>;
				const DateInputComponentProps = filterConfig.inputComponentProps as DateInputProps;
				const selectedDate = value.val ? parseISO(value.val) : new Date();

				return (
					<DateInputComponent
						{...DateInputComponentProps}
						className={clsx(
							styles['c-advanced-filter-fields__dynamic-field'],
							styles['c-advanced-filter-fields__dynamic-field--datepicker']
						)}
						value={selectedDate}
						onChange={(newDate: Date) => {
							onFieldChange({
								val: newDate ? newDate.toISOString() : undefined,
							});
						}}
					/>
				);
			}

			case AutocompleteFieldInput: {
				const AutocompleteFieldInput =
					filterConfig.inputComponent as FC<AutocompleteFieldInputProps>;
				const AutocompleteFieldInputProps =
					filterConfig.inputComponentProps as AutocompleteFieldInputProps;

				return (
					<AutocompleteFieldInput
						{...AutocompleteFieldInputProps}
						className={clsx(
							styles['c-advanced-filter-fields__dynamic-field'],
							styles['c-advanced-filter-fields__dynamic-field--datepicker']
						)}
						value={value.val}
						onChange={(newValue: string | null) =>
							onFieldChange({
								val: newValue || undefined,
							})
						}
					/>
				);
			}

			default:
				console.warn(`[WARN][AdvancedFilterFields] No render definition found for ${value.prop}`);
				return null;
		}
	};

	return (
		<div className={styles['c-advanced-filter-fields']}>
			<FormControl
				className="c-form-control--label-hidden"
				id={`${labelKeys.property}__${index}`}
				label={tHtml(
					'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___veldnaam'
				)}
			>
				<ReactSelect
					components={{ IndicatorSeparator: () => null }}
					inputId={`${labelKeys.property}__${index}`}
					onChange={(newValue) => {
						const prop = (newValue as SingleValue<SelectOption>)?.value as SearchFilterId;
						const operators = prop ? getOperators(prop) : [];

						onFieldChange({
							prop: value.prop,
							op: operators.length > 0 ? operators[0].value : undefined,
							val: undefined,
						});
					}}
					options={getAdvancedProperties()}
					value={getSelectValue(getAdvancedProperties(), value.prop)}
				/>
			</FormControl>

			{operators.length > 0 && (
				<FormControl
					className="c-form-control--label-hidden"
					id={`${labelKeys.operator}__${index}`}
					label={tHtml(
						'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___operator'
					)}
				>
					<ReactSelect
						components={{ IndicatorSeparator: () => null }}
						inputId={`${labelKeys.operator}__${index}`}
						onChange={(newValue) =>
							onFieldChange({
								op: (newValue as SingleValue<SelectOption>)?.value as Operator,
								val: undefined,
							})
						}
						options={operators}
						value={getSelectValue(operators, value.op)}
					/>
				</FormControl>
			)}

			<FormControl
				className={clsx(
					styles['c-advanced-filter-fields__field-container'],
					'c-form-control--label-hidden'
				)}
				id={`${labelKeys.value}__${index}`}
				label={tHtml(
					'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___waarde'
				)}
			>
				{renderField({
					id: `${labelKeys.value}__${index}`,
				})}

				{index > 0 && (
					<Button
						icon={<Icon name={IconNamesLight.Trash} aria-hidden />}
						aria-label={tText(
							'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___criterium-verwijderen'
						)}
						variants="black"
						onClick={() => onRemove(index)}
					/>
				)}
			</FormControl>
		</div>
	);
};
