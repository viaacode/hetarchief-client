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
	type LanguageCode,
	LANGUAGES,
} from '@visitor-space/components/LanguageFilterForm/languages';
import { LanguageSelect } from '@visitor-space/components/LanguageSelect/LanguageSelect';
import { MediaTypeSelect } from '@visitor-space/components/MediaTypeSelect';
import { MediumSelect } from '@visitor-space/components/MediumSelect/MediumSelect';
import { ObjectTypeSelect } from '@visitor-space/components/ObjectTypeSelect';
import type {
	FilterConfig,
	FilterInputComponentProps,
} from '@visitor-space/const/advanced-filters.consts';

import type { AdvancedFilter, FilterProperty, Operator } from '../../types';
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
	value: state,
	onChange,
	onRemove,
}) => {
	const locale = useLocale();

	// Computed

	const operators = getOperators(state.prop as FilterProperty);
	const operator = state.op || operators?.[0]?.value || null;

	// Events

	const onFieldChange = (data: Partial<AdvancedFilter>) => {
		onChange(index, { ...state, ...data });
	};

	// Render

	const renderTextField = (
		Component: FC<TextInputProps>,
		value?: string,
		props?: TextInputProps
	) => (
		<Component
			{...props}
			className={clsx(
				styles['c-advanced-filter-fields__dynamic-field'],
				styles['c-advanced-filter-fields__dynamic-field--text']
			)}
			value={value}
			onChange={(e) =>
				onFieldChange({
					val: e.target.value,
				})
			}
		/>
	);

	const renderField = (config?: FilterInputComponentProps) => {
		const filterConfig: FilterConfig | null = operator
			? getFilterConfig(state.prop as FilterProperty, operator as Operator)
			: null;
		if (!filterConfig) {
			console.error('Unknown filter config', state.prop, operator);
			return null;
		}

		const props: FilterInputComponentProps = {
			...(filterConfig?.inputComponentProps || {}),
			...config,
		} as FilterInputComponentProps;

		switch (filterConfig.inputComponent) {
			case TextInput: {
				const TextInputComponent = filterConfig.inputComponent as FC<TextInputProps>;
				const textInputComponentProps = filterConfig.inputComponentProps as TextInputProps;
				return renderTextField(TextInputComponent, state.val, {
					...textInputComponentProps,
					...(props as TextInputProps),
				});
			}

			case DateRangeInput: {
				const split = ((state.val || '') as string).split(SEPARATOR, 2);

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
				const value = state.val || defaultValue; // Ensure initial value is hh:mm:ss
				const TextInputComponent = filterConfig.inputComponent as FC<TextInputProps>;
				const textInputComponent = filterConfig.inputComponentProps as TextInputProps;

				return renderTextField(TextInputComponent, value, {
					...textInputComponent,
					...(props as TextInputProps),
				});
			}

			case DurationRangeInput: {
				const value = state.val || `${defaultValue}${SEPARATOR}${defaultValue}`; // Ensure initial value is hh:mm:ss for both fields
				const TextInputComponent = filterConfig.inputComponent as FC<TextInputProps>;
				const textInputComponentProps = filterConfig.inputComponentProps as TextInputProps;

				return renderTextField(TextInputComponent, value, {
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
				const value =
					getSelectValue(
						((props as ReactSelectProps).options || []) as SelectOption[],
						state.val
					) || state.val
						? { label: state.val as string, value: state.val as string }
						: undefined;

				return (
					<SelectComponent
						{...(selectComponentProps || {})}
						{...(props as ReactSelectProps)}
						className={clsx(
							styles['c-advanced-filter-fields__dynamic-field'],
							styles['c-advanced-filter-fields__dynamic-field--select']
						)}
						value={value}
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
				const value =
					getSelectValue(
						((props as ReactSelectProps).options || []) as SelectOption[],
						state.val
					) || state.val
						? {
								label: LANGUAGES[locale][state.val as LanguageCode],
								value: state.val as string,
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
						value={value}
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
				const value = state.val ? parseISO(state.val) : new Date();

				return (
					<DateInputComponent
						{...DateInputComponentProps}
						className={clsx(
							styles['c-advanced-filter-fields__dynamic-field'],
							styles['c-advanced-filter-fields__dynamic-field--datepicker']
						)}
						value={value}
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
						value={state.val}
						onChange={(newValue: string | null) =>
							onFieldChange({
								val: newValue || undefined,
							})
						}
					/>
				);
			}

			default:
				console.warn(`[WARN][AdvancedFilterFields] No render definition found for ${state.prop}`);
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
						const prop = (newValue as SingleValue<SelectOption>)?.value;
						const operators = prop ? getOperators(prop as FilterProperty) : [];

						onFieldChange({
							prop,
							op: operators.length > 0 ? operators[0].value : undefined,
							val: undefined,
						});
					}}
					options={getAdvancedProperties()}
					value={getSelectValue(getAdvancedProperties(), state.prop)}
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
								op: (newValue as SingleValue<SelectOption>)?.value,
								val: undefined,
							})
						}
						options={operators}
						value={getSelectValue(operators, state.op)}
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
