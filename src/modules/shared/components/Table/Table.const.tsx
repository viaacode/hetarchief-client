import { TableSortingIcons } from '@meemoo/react-components';

import { Icon, IconNamesLight } from '../Icon';

export const sortingIcons: TableSortingIcons = {
	asc: <Icon className="c-sorting-icon" name={IconNamesLight.ArrowUp} />,
	default: <Icon className="c-sorting-icon" name={IconNamesLight.SortTable} />,
	desc: <Icon className="c-sorting-icon" name={IconNamesLight.ArrowDown} />,
};
