import { IconTypes } from '../../Icon';

import { DefaultComponentProps } from '@shared/types';

export interface DropdownListProps extends DefaultComponentProps {
	listItems: DropdownListItem[][]; // divider between arrays
}

export interface DropdownListItem {
	icon: IconTypes;
	label: string;
	onClick: () => void;
}
