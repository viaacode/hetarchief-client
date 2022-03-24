import {
	Button,
	DatepickerProps,
	ReactSelect,
	ReactSelectProps,
	SelectOption,
	TextInput,
	TextInputProps,
} from '@meemoo/react-components';
import clsx from 'clsx';
import React, { FC } from 'react';
import { SingleValue } from 'react-select';

import {
	DateInput,
	DateRangeInput,
	DurationInput,
	DurationRangeInput,
	GenreSelect,
	MediaTypeSelect,
	MediumSelect,
} from '@reading-room/components';
import { AdvancedFilter, MetadataProp } from '@reading-room/types';
import { getField, getOperators, getProperties } from '@reading-room/utils';
import { getSelectValue } from '@reading-room/utils/select';
import { Icon } from '@shared/components';
import { SEPARATOR } from '@shared/const';
import { Operator } from '@shared/types';

import styles from './AdvancedFilterFields.module.scss';
import { AdvancedFilterFieldsProps } from './AdvancedFilterFields.types';

const AdvancedFilterFields: FC<AdvancedFilterFieldsProps> = ({
	index,
	value: state,
	onChange,
	onRemove,
}) => {
	// Computed

	const operators = getOperators(state.prop as MetadataProp);
	const operator = state.op || operators?.[0]?.value || null;

	// Events

	const onFieldChange = (data: Partial<AdvancedFilter>) => {
		onChange(index, { ...state, ...data });
	};

	// Render

	const renderTextField = (Component: FC<TextInputProps>, value?: string) => (
		<Component
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

	const renderField = () => {
		let Component = operator
			? getField(state.prop as MetadataProp, operator as Operator)
			: null;

		let value;
		let props = Component && Component.defaultProps;

		switch (Component) {
			case TextInput:
			case DateRangeInput:
				value = state.val;
				Component = Component as FC<TextInputProps>;

				return renderTextField(Component, value);

			case DurationInput:
				value = state.val || '00:00:00'; // Ensure initial value is hh:mm:ss
				Component = Component as FC<TextInputProps>;

				return renderTextField(Component, value);

			case DurationRangeInput:
				value = state.val || `00:00:00${SEPARATOR}00:00:00`; // Ensure initial value is hh:mm:ss for both fields
				Component = Component as FC<TextInputProps>;

				return renderTextField(Component, value);

			case ReactSelect:
			case MediaTypeSelect:
			case GenreSelect:
			case MediumSelect:
				Component = Component as FC<ReactSelectProps>;
				props = props as ReactSelectProps;
				value = getSelectValue(props ? (props.options as SelectOption[]) : [], state.val);

				return (
					<Component
						className={clsx(
							styles['c-advanced-filter-fields__dynamic-field'],
							styles['c-advanced-filter-fields__dynamic-field--select']
						)}
						value={value}
						onChange={(e) =>
							onFieldChange({
								val: (e as SingleValue<SelectOption>)?.value ?? undefined,
							})
						}
					/>
				);

			case DateInput:
				Component = Component as FC<DatepickerProps>;
				value = state.val;

				return (
					<Component
						className={clsx(
							styles['c-advanced-filter-fields__dynamic-field'],
							styles['c-advanced-filter-fields__dynamic-field--datepicker']
						)}
						value={value}
						onChange={(e) =>
							onFieldChange({
								val: e?.valueOf().toString(),
							})
						}
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
			<ReactSelect
				components={{ IndicatorSeparator: () => null }}
				options={getProperties()}
				value={getSelectValue(getProperties(), state.prop)}
				onChange={(newValue) => {
					const prop = (newValue as SingleValue<SelectOption>)?.value;
					const operators = prop ? getOperators(prop as MetadataProp) : [];

					onFieldChange({
						prop,
						op: operators.length > 0 ? operators[0].value : undefined,
						val: undefined,
					});
				}}
			/>
			<ReactSelect
				components={{ IndicatorSeparator: () => null }}
				options={operators}
				value={getSelectValue(operators, state.op)}
				onChange={(newValue) =>
					onFieldChange({
						op: (newValue as SingleValue<SelectOption>)?.value,
						val: undefined,
					})
				}
			/>
			<div className={styles['c-advanced-filter-fields__field-container']}>
				{renderField()}
				{index > 0 && (
					<Button
						icon={<Icon name="trash" />}
						variants="black"
						onClick={() => onRemove(index)}
					/>
				)}
			</div>
		</div>
	);
};

export default AdvancedFilterFields;
