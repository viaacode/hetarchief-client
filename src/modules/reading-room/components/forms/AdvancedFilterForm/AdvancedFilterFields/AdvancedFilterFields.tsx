import { Button, ReactSelect, SelectOption } from '@meemoo/react-components';
import { FC } from 'react';
import { SingleValue } from 'react-select';

import { Icon } from '@shared/components';

import { AdvancedFilterFieldsState } from '../AdvancedFilterForm.types';

import {
	METADATA_FIELD_MAP,
	METADATA_PROP_OPTIONS,
	OPERATOR_OPTIONS,
} from './AdvancedFilterFields.const';
import styles from './AdvancedFilterFields.module.scss';
import { AdvancedFilterFieldsProps, MetadataProp } from './AdvancedFilterFields.types';

const AdvancedFilterFields: FC<AdvancedFilterFieldsProps> = ({
	index,
	value,
	onChange,
	onRemove,
}) => {
	const ValueField = METADATA_FIELD_MAP[value.metadataProp as MetadataProp] ?? (() => null);

	const getSelectValue = (options: SelectOption[], optionValue: string | undefined) => {
		return options.find((option) => option.value === optionValue);
	};

	const onFieldChange = <K extends keyof AdvancedFilterFieldsState>(
		name: K,
		updatedValue: AdvancedFilterFieldsState[K]
	) => {
		console.log(updatedValue);

		onChange(index, { ...value, [name]: updatedValue });
	};

	return (
		<div className={styles['c-advanced-filter-fields']}>
			<ReactSelect
				components={{ IndicatorSeparator: () => null }}
				options={METADATA_PROP_OPTIONS()}
				value={getSelectValue(METADATA_PROP_OPTIONS(), value.metadataProp)}
				onChange={(newValue) =>
					onFieldChange('metadataProp', (newValue as SingleValue<SelectOption>)?.value)
				}
			/>
			<ReactSelect
				components={{ IndicatorSeparator: () => null }}
				options={OPERATOR_OPTIONS()}
				value={getSelectValue(OPERATOR_OPTIONS(), value.operator)}
				onChange={(newValue) =>
					onFieldChange('operator', (newValue as SingleValue<SelectOption>)?.value)
				}
			/>
			<div className={styles['c-advanced-filter-fields__field-container']}>
				<ValueField
					className={styles['c-advanced-filter-fields__dynamic-field']}
					value={value.value}
					onChange={(e) => onFieldChange('value', e.target.value)}
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
