import { IconTypes } from '../../Icon';

import { DefaultComponentProps } from '@shared/types';

export interface DropdownListItemProps extends DefaultComponentProps {
	icon?: IconTypes;
	label: string;
	onClick: () => void;
}
