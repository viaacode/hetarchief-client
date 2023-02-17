import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

import { MediaActions } from 'modules/ie-objects/types';

export interface DynamicActionMenuProps extends DefaultComponentProps {
	actions: ActionItem[];
	limit?: number;
	onClickAction: (id: MediaActions) => void;
}

export interface ActionItem {
	label: string;
	icon: ReactNode;
	id: MediaActions;
	ariaLabel: string;
	tooltip?: string;
}
