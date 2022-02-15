import { TableSortingIcons } from '@meemoo/react-components';

import { Icon } from '../Icon';

export const sortingIcons: TableSortingIcons = {
	asc: <Icon className="c-sorting-icon" name="arrow-up" />,
	default: <Icon className="c-sorting-icon" name="sort-table" />,
	desc: <Icon className="c-sorting-icon" name="arrow-down" />,
};
