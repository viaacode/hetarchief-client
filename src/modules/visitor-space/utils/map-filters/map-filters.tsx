import type { SelectOption } from '@meemoo/react-components';
import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { formatDate } from '@shared/utils/dates';
import { format, parseISO } from 'date-fns';
import {
	AdvancedFilterArrayParam,
	getFilterLabel,
	getOperators,
} from '../../const/advanced-filter-array-param';
import { getMetadataSearchFilters } from '../../const/advanced-filters.consts';
import {
	FILTER_LABEL_VALUE_DELIMITER,
	type FilterValue,
	type FilterValueTag,
	Operator,
} from '../../types';

const getSelectLabel = (
	options: SelectOption[],
	optionValue: string | undefined
): string | undefined => {
	return options.find((option) => option.value === optionValue)?.label;
};

// Prevent duplicate values by prefixing the value with the filter key (e.g. creator--shd)
export const tagPrefix = (key: string): string => `${key}--`;

export const mapAdvancedToTags = (
	filterValues: Array<FilterValue>,
	key: IeObjectsSearchFilterField = IeObjectsSearchFilterField.ADVANCED
): FilterValueTag[] => {
	return (
		filterValues.flatMap?.((filterValue: FilterValue) => {
			const filterProp = filterValue.field as IeObjectsSearchFilterField;
			const filterOp = filterValue.operator as Operator;

			const values = filterValue.multiValue || [];

			const filterPropLabel = getFilterLabel(filterProp);
			let filterOperatorLabel = getSelectLabel(getOperators(filterProp), filterOp);
			return filterValue.multiValue.map((value, i) => {
				let valueLabel = value.split(FILTER_LABEL_VALUE_DELIMITER).pop();

				// Convert certain values to be legible

				switch (filterProp) {
					case IeObjectsSearchFilterField.CREATED:
					case IeObjectsSearchFilterField.PUBLISHED:
					case IeObjectsSearchFilterField.RELEASE_DATE:
						if (filterOp === Operator.BETWEEN || filterOp === Operator.IS) {
							valueLabel = `${formatDate(parseISO(values[0]))} - ${formatDate(parseISO(values[1]))}`;
							filterOperatorLabel = undefined;
						} else {
							valueLabel = value ? formatDate(parseISO(value)) : '';
						}
						break;

					case IeObjectsSearchFilterField.DURATION:
						if (filterOp === Operator.BETWEEN) {
							valueLabel = `${values[0]} - ${values[1]}`;
							filterOperatorLabel = undefined;
						}
						break;

					default:
						break;
				}

				// Define render structure
				const unique = `${tagPrefix(key)}${AdvancedFilterArrayParam.encode([filterValue])}`;

				return {
					label: (
						<span>
							{`${filterPropLabel}:`}
							<strong>
								{filterOperatorLabel && ` ${filterOperatorLabel?.toLowerCase()}`}
								{` ${valueLabel}`}
							</strong>
						</span>
					),
					value: unique,
					id: filterValue.field as string,
					filterValue,
				};
			});
		}) || []
	);
};

export const mapAdvancedToElastic = (item: FilterValue): FilterValue[] => {
	const values = item.multiValue || [];
	const filterProp = item.field as IeObjectsSearchFilterField;
	const filterOperator = item.operator as Operator;
	const filters =
		filterProp && filterOperator ? getMetadataSearchFilters(filterProp, filterOperator) : [];

	// Format data for Elastic
	return filters.map((filter: FilterValue, i: number): FilterValue => {
		let parsed: Date;
		let operator: Operator = Operator.IS;

		switch (item.field) {
			case IeObjectsSearchFilterField.CREATED:
			case IeObjectsSearchFilterField.PUBLISHED:
			case IeObjectsSearchFilterField.RELEASE_DATE:
				parsed = parseISO(values[i]);
				values[i] = (parsed && format(parsed, 'yyyy-MM-dd')) || values[i];
				if (filterOperator === Operator.BETWEEN) {
					operator = i === 0 ? Operator.GTE : Operator.LTE;
				}
				break;
			case IeObjectsSearchFilterField.DURATION:
				// Manually create a range of equal values
				// Add milliseconds since elasticsearch requires it: https://meemoo.atlassian.net/browse/ARC-2549
				values[i] = `${values[0]}.00`;
				break;
			default:
				break;
		}

		return { ...filter, multiValue: values };
	});
};
