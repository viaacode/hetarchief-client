import { CheckboxList } from '@meemoo/react-components';
import { tHtml } from '@shared/helpers/translate';
import { SEARCH_PAGE_QUERY_PARAM_CONFIG } from '@visitor-space/const';
import { useGetFilterOptions } from '@visitor-space/hooks/get-filter-options';
import type { GenericFilterFormProps } from '@visitor-space/types';
import { sortFilterOptions } from '@visitor-space/utils/sort-filter-options';
import clsx from 'clsx';
import { compact, without } from 'es-toolkit/compat';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';

/**
 * A filter with a fixed list of at most ten values, so it opens without a search field.
 * See the "Checkbox filters" section of the ARC-3806 FA.
 */
export const CheckboxListFilterForm: FC<GenericFilterFormProps> = ({
	children,
	className,
	filter,
	disabled,
}) => {
	const [query] = useQueryParams(SEARCH_PAGE_QUERY_PARAM_CONFIG);

	const appliedValues: string[] = compact(query[filter.id] || []);
	const [selectedValues, setSelectedValues] = useState<string[]>(() => appliedValues);

	const { reset, handleSubmit } = useForm({ defaultValues: {} });
	const fixedOptions = filter.options?.();
	const { options: aggregatedOptions } = useGetFilterOptions(filter, !disabled && !fixedOptions);
	const options = fixedOptions ?? aggregatedOptions;

	const onItemClick = (checked: boolean, value: unknown): void => {
		setSelectedValues(
			checked ? without(selectedValues, value as string) : [...selectedValues, value as string]
		);
	};

	const checkboxOptions = sortFilterOptions(
		options.map((option) => ({
			label: option.label,
			value: option.value,
			checked: selectedValues.includes(option.value),
		})),
		appliedValues
	);

	return (
		<>
			<div className={clsx(className, 'u-px-32 u-px-20-md')}>
				<div className="c-filter-form__body">
					{options.length === 0 && (
						<p className="u-color-neutral u-text-center">
							{tHtml(
								'modules/visitor-space/components/checkbox-list-filter-form/checkbox-list-filter-form___geen-waarden-gevonden'
							)}
						</p>
					)}

					<CheckboxList
						items={checkboxOptions}
						onItemClick={onItemClick}
						id={`checkbox-list-filter-form-${filter.id}`}
					/>
				</div>
			</div>

			{children({
				values: { [filter.id]: selectedValues },
				reset: () => {
					reset();
					setSelectedValues([]);
				},
				handleSubmit,
			})}
		</>
	);
};
