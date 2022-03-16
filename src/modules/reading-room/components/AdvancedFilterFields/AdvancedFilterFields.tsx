import {
	Button,
	ReactSelect,
	ReactSelectProps,
	SelectOption,
	TextInput,
} from '@meemoo/react-components';
import React, { ChangeEvent, FC } from 'react';
import { PropsValue, SingleValue } from 'react-select';

import { MetadataFields } from '@reading-room/const';
import { MetadataProp } from '@reading-room/types';
import { getField, getOperators, getProperties } from '@reading-room/utils';
import { Icon } from '@shared/components';
import { Operator } from '@shared/types';

import { AdvancedFilterFieldsState } from '../AdvancedFilterForm/AdvancedFilterForm.types';
import { DurationInput } from '../DurationInput';
import { DurationRangeInput } from '../DurationRangeInput';
import { MediaTypeSelect } from '../MediaTypeSelect';

import styles from './AdvancedFilterFields.module.scss';
import { AdvancedFilterFieldsProps } from './AdvancedFilterFields.types';

// Cast to this to avoid TS complaints with ReactSelect
type AdvancedFilterFieldsValueProp = (string | number | readonly string[]) &
	PropsValue<SelectOption>;

const AdvancedFilterFields: FC<AdvancedFilterFieldsProps> = ({
	index,
	value: state,
	onChange,
	onRemove,
}) => {
	const getSelectValue = (options: SelectOption[], optionValue: string | undefined | null) => {
		return options.find((option) => option.value === optionValue);
	};

	const operators = getOperators(state.metadataProp as MetadataProp);
	const operator = state.operator || (operators.length > 0 && operators[0].value) || null;

	const Field = operator
		? getField(state.metadataProp as MetadataProp, operator as Operator)
		: null;

	const fieldValue = () => {
		let props = Field && Field.defaultProps;

		switch (Field) {
			case ReactSelect:
			case MediaTypeSelect:
				props = props as ReactSelectProps;

				return getSelectValue(props && (props.options as SelectOption[]), state.value);

			default:
				return state.value;
		}
	};

	const onFieldChange = (data: Partial<AdvancedFilterFieldsState>) => {
		onChange(index, { ...state, ...data });
	};

	return (
		<div className={styles['c-advanced-filter-fields']}>
			<ReactSelect
				components={{ IndicatorSeparator: () => null }}
				options={getProperties()}
				value={getSelectValue(getProperties(), state.metadataProp)}
				onChange={(newValue) => {
					const metadataProp = (newValue as SingleValue<SelectOption>)?.value;
					const operators = metadataProp
						? getOperators(metadataProp as MetadataProp)
						: [];

					onFieldChange({
						metadataProp,
						operator: operators.length > 0 ? operators[0].value : undefined,
						value: undefined,
					});
				}}
			/>
			<ReactSelect
				components={{ IndicatorSeparator: () => null }}
				options={operators}
				value={getSelectValue(operators, state.operator)}
				onChange={(newValue) =>
					onFieldChange({ operator: (newValue as SingleValue<SelectOption>)?.value })
				}
			/>
			<div className={styles['c-advanced-filter-fields__field-container']}>
				{Field && (
					<Field
						className={styles['c-advanced-filter-fields__dynamic-field']}
						value={fieldValue() as AdvancedFilterFieldsValueProp} // TODO: avoid cast (?)
						onChange={(e) => {
							// 1 case for each FC in METADATA_FIELD_MAP
							switch (Field) {
								case TextInput:
								case DurationInput:
								case DurationRangeInput:
									e = e as ChangeEvent<HTMLInputElement>;

									return onFieldChange({
										value: e.target.value,
									});

								case ReactSelect:
								case MediaTypeSelect:
									e = e as SingleValue<SelectOption>;

									return onFieldChange({
										value: e?.value ?? undefined,
									});

								default:
									break;
							}
						}}
					/>
				)}
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
