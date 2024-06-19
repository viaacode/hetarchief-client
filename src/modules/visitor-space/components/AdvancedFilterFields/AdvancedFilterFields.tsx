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
import { type SingleValue } from 'react-select';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { SEPARATOR } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { type Operator } from '@shared/types';
import { type AdvancedFilterFieldsProps } from '@visitor-space/components/AdvancedFilterFields/AdvancedFilterFields.types';
import { DateInput } from '@visitor-space/components/DateInput';
import { type DateInputProps } from '@visitor-space/components/DateInput/DateInput';
import { DateRangeInput } from '@visitor-space/components/DateRangeInput';
import { type DateRangeInputProps } from '@visitor-space/components/DateRangeInput/DateRangeInput';
import { DurationRangeInput } from '@visitor-space/components/DurationRangeInput';
import { GenreSelect } from '@visitor-space/components/GenreSelect';
import { MediaTypeSelect } from '@visitor-space/components/MediaTypeSelect';
import { MediumSelect } from '@visitor-space/components/MediumSelect';
import { ObjectTypeSelect } from '@visitor-space/components/ObjectTypeSelect';
import { type MetadataFieldProps } from '@visitor-space/const/metadata';
import { getAdvancedProperties, getField, getOperators } from '@visitor-space/utils/metadata';

import { type AdvancedFilter, type MetadataProp } from '../../types';
import { getSelectValue } from '../../utils/select';
import DurationInput, { defaultValue } from '../DurationInput/DurationInput';

import styles from './AdvancedFilterFields.module.scss';

const labelKeys = {
	prefix: 'AdvancedFilterFields',
	property: 'AdvancedFilterFields__field',
	operator: 'AdvancedFilterFields__operator',
	value: 'AdvancedFilterFields__value',
};

const AdvancedFilterFields: FC<AdvancedFilterFieldsProps> = ({
	index,
	value: state,
	onChange,
	onRemove,
}) => {
	const { tHtml, tText } = useTranslation();

	// Computed

	const operators = getOperators(state.prop as MetadataProp);
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

	const renderField = (config?: MetadataFieldProps) => {
		let Component: any = operator
			? getField(state.prop as MetadataProp, operator as Operator)
			: null;

		let value;
		let props =
			Component &&
			({
				...Component.defaultProps,
				...config,
			} as MetadataFieldProps);

		switch (Component) {
			case TextInput:
				value = state.val;
				Component = Component as FC<TextInputProps>;
				props = props as TextInputProps;

				return renderTextField(Component, value, props);

			case DateRangeInput: {
				const split = ((value || '') as string).split(SEPARATOR, 2);

				const from: Date = split[0] ? parseISO(split[0]) : new Date();
				const to: Date = split[1] ? parseISO(split[1]) : new Date();

				Component = Component as unknown as FC<DateRangeInputProps>;
				return (
					<Component
						className={clsx(
							styles['c-advanced-filter-fields__dynamic-field'],
							styles['c-advanced-filter-fields__dynamic-field--select']
						)}
						from={from}
						to={to}
						onChange={(newFromDate: Date, newToDate: Date) =>
							onFieldChange({
								val:
									`${newFromDate.toISOString()}${SEPARATOR}${newToDate.toISOString()}` ??
									undefined,
							})
						}
					/>
				);
			}

			case DurationInput:
				value = state.val || defaultValue; // Ensure initial value is hh:mm:ss
				Component = Component as FC<TextInputProps>;
				props = props as TextInputProps;

				return renderTextField(Component, value, props);

			case DurationRangeInput:
				value = state.val || `${defaultValue}${SEPARATOR}${defaultValue}`; // Ensure initial value is hh:mm:ss for both fields
				Component = Component as FC<TextInputProps>;
				props = props as TextInputProps;

				return renderTextField(Component, value, props);

			case ReactSelect:
			case MediaTypeSelect:
			case GenreSelect:
			case MediumSelect:
			case ObjectTypeSelect:
				Component = Component as FC<ReactSelectProps>;
				props = props as ReactSelectProps;
				value = getSelectValue((props.options || []) as SelectOption[], state.val);

				return (
					<Component
						className={clsx(
							styles['c-advanced-filter-fields__dynamic-field'],
							styles['c-advanced-filter-fields__dynamic-field--select']
						)}
						value={value}
						onChange={(e: any) =>
							onFieldChange({
								val: (e as SingleValue<SelectOption>)?.value ?? undefined,
							})
						}
					/>
				);

			case DateInput:
				Component = Component as FC<DateInputProps>;
				value = state.val ? parseISO(state.val) : new Date();

				return (
					<Component
						className={clsx(
							styles['c-advanced-filter-fields__dynamic-field'],
							styles['c-advanced-filter-fields__dynamic-field--datepicker']
						)}
						value={value}
						onChange={(newDate: Date) => {
							onFieldChange({
								val: newDate ? newDate.toString() : undefined,
							});
						}}
					/>
				);

			default:
				console.warn(
					`[WARN][AdvancedFilterFields] No render definition found for ${state.prop}`
				);
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
						const operators = prop ? getOperators(prop as MetadataProp) : [];

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

export default AdvancedFilterFields;
