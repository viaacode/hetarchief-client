import {
	Button,
	ReactSelect,
	ReactSelectProps,
	SelectOption,
	TextInput,
} from '@meemoo/react-components';
import React, { ChangeEvent, FC } from 'react';
import { PropsValue, SingleValue } from 'react-select';

import { getOperators } from '@reading-room/utils';
import { Icon } from '@shared/components';

import { AdvancedFilterFieldsState } from '../AdvancedFilterForm/AdvancedFilterForm.types';
import { DurationInput } from '../DurationInput';
import { MediaTypeSelect } from '../MediaTypeSelect';

import { METADATA_FIELD_MAP, METADATA_PROP_OPTIONS } from './AdvancedFilterFields.const';
import styles from './AdvancedFilterFields.module.scss';
import { AdvancedFilterFieldsProps, MetadataProp } from './AdvancedFilterFields.types';

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

	const OperatorField = getOperators(state.metadataProp as MetadataProp);
	const Field = METADATA_FIELD_MAP[state.metadataProp as MetadataProp] ?? (() => null);
	const FieldValue = () => {
		let props = Field.defaultProps;

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
				options={METADATA_PROP_OPTIONS()}
				value={getSelectValue(METADATA_PROP_OPTIONS(), state.metadataProp)}
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
				options={OperatorField}
				value={getSelectValue(OperatorField, state.operator)}
				onChange={(newValue) =>
					onFieldChange({ operator: (newValue as SingleValue<SelectOption>)?.value })
				}
			/>
			<div className={styles['c-advanced-filter-fields__field-container']}>
				<Field
					className={styles['c-advanced-filter-fields__dynamic-field']}
					value={FieldValue() as AdvancedFilterFieldsValueProp} // TODO: avoid cast (?)
					onChange={(e) => {
						// 1 case for each FC in METADATA_FIELD_MAP
						switch (Field) {
							case TextInput:
							case DurationInput:
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
