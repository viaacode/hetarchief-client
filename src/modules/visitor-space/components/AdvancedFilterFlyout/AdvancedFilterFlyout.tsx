import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { FilterButton } from '@visitor-space/components/FilterMenu/FilterButton';
import type { FilterMenuFilterOption } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import type { SearchFilterId } from '@visitor-space/types';
import clsx from 'clsx';
import type { FC } from 'react';
import styles from './AdvancedFilterFlyout.module.scss';

export interface AdvancedFilterFlyoutProps {
	className?: string;
	/** Every filter of the active tab that opens a modal, already sorted alphabetically. */
	filters: FilterMenuFilterOption[];
	onFilterClick: (id: SearchFilterId) => void;
}

/**
 * The list behind the "Geavanceerd" button. Picking a filter here puts it in the filter panel and
 * opens its modal. See the "Redesign van geavanceerde filters" section of the ARC-3806 FA.
 */
export const AdvancedFilterFlyout: FC<AdvancedFilterFlyoutProps> = ({
	className,
	filters,
	onFilterClick,
}) => (
	<ul className={clsx(className, styles['c-advanced-filter-flyout'])}>
		{filters.map((filter) => (
			<li key={`advanced-filter-flyout-${filter.id}`}>
				<FilterButton
					icon={IconNamesLight.AngleRight}
					isActive={false}
					label={filter.label}
					onClick={() => onFilterClick(filter.id)}
				/>
			</li>
		))}
	</ul>
);
