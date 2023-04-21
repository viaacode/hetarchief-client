import { ReactNode } from 'react';

import { MediaActions } from '@ie-objects/types';
import { DefaultComponentProps } from '@shared/types';

export interface DynamicActionMenuProps extends DefaultComponentProps {
	actions: ActionItem[];
	limit?: number;
	onClickAction: (id: MediaActions) => void;
}

export interface ActionItem {
	label: string;
	id: MediaActions;
	ariaLabel: string;
	icon?: ReactNode;
	tooltip?: string;
	isPrimary?: boolean;
	customElement?: ReactNode;
}
