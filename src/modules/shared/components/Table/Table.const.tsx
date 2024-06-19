import { type TableSortingIcons } from '@meemoo/react-components';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

export const sortingIcons: TableSortingIcons = {
	asc: <Icon className="c-sorting-icon" name={IconNamesLight.ArrowUp} />,
	default: <Icon className="c-sorting-icon" name={IconNamesLight.SortTable} />,
	desc: <Icon className="c-sorting-icon" name={IconNamesLight.ArrowDown} />,
};
