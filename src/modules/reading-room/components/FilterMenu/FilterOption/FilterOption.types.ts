import { DefaultComponentProps } from '@shared/types';

import { FilterMenuFilterOption } from '../FilterMenu.types';

export interface FilterOptionProps extends DefaultComponentProps, FilterMenuFilterOption {
	activeFilter: string | null;
	onClick?: (filterId: string) => void;
}
