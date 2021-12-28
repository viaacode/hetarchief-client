import { DropdownListItemProps } from '../DropdownListItem';

import { DefaultComponentProps } from '@shared/types';

export interface DropdownListProps extends DefaultComponentProps {
	listItems: DropdownListItemProps[][]; // divider between arrays
}
