import { getRandomId } from '@shared/helpers/get-random-id';
import { AdvancedFilterFields } from '@visitor-space/components/AdvancedFilterFields/AdvancedFilterFields';
import { SEARCH_PAGE_QUERY_PARAM_CONFIG } from '@visitor-space/const';
import { TEMP_FILTER_KEY_PREFIX } from '@visitor-space/const/advanced-filter-array-param';
import type {
	AdvancedFilter,
	FilterProperty,
	GenericFilterFormProps,
	IdentityAdvancedFilter,
} from '@visitor-space/types';
import { getOperators } from '@visitor-space/utils/advanced-filters';
import clsx from 'clsx';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';
import { v4 as uuidV4 } from 'uuid';

/**
 * The date and duration filters the FA of ARC-3806 leaves as they are: one operator dropdown plus
 * the input that belongs to the chosen operator. It is one AdvancedFilterFields row with the
 * property fixed to the filter it belongs to.
 */
export const SinglePropertyFilterForm: FC<GenericFilterFormProps> = ({
	children,
	className,
	filter,
}) => {
	const [query] = useQueryParams(SEARCH_PAGE_QUERY_PARAM_CONFIG);
	const property = filter.property as FilterProperty;

	const initialValue = (query[filter.id] as AdvancedFilter[] | undefined)?.[0];

	const [filterValue, setFilterValue] = useState<IdentityAdvancedFilter>(() => ({
		renderKey: TEMP_FILTER_KEY_PREFIX + uuidV4(),
		id: getRandomId(),
		prop: property,
		op: initialValue?.op || getOperators(property)?.[0]?.value,
		val: initialValue?.val,
	}));

	const { reset, handleSubmit } = useForm({ defaultValues: {} });

	return (
		<>
			<div className={clsx(className, 'u-px-32 u-px-20-md')}>
				<AdvancedFilterFields
					hideProperty
					id={filterValue.id}
					index={0}
					filterValue={filterValue}
					onChange={(_index, newValue) => setFilterValue(newValue)}
					onRemove={() => null}
				/>
			</div>

			{children({
				values: {
					[filter.id]: filterValue.val
						? [{ prop: filterValue.prop, op: filterValue.op, val: filterValue.val }]
						: [],
				},
				reset: () => {
					reset();
					setFilterValue({
						renderKey: TEMP_FILTER_KEY_PREFIX + uuidV4(),
						id: getRandomId(),
						prop: property,
						op: getOperators(property)?.[0]?.value,
						val: undefined,
					});
				},
				handleSubmit,
			})}
		</>
	);
};
