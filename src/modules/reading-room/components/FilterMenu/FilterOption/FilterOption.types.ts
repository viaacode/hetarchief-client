import { DefaultComponentProps } from '@shared/types';

import {
	FilterMenuFilterOption,
	OnFilterMenuFormReset,
	OnFilterMenuFormSubmit,
} from '../FilterMenu.types';

export interface FilterOptionProps extends DefaultComponentProps, FilterMenuFilterOption {
	activeFilter: string | null;
	values?: unknown;
	onClick?: (filterId: string) => void;
	onFormSubmit: OnFilterMenuFormSubmit;
	onFormReset: OnFilterMenuFormReset;
}
