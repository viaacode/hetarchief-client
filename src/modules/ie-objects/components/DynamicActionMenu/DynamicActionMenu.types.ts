import { ReactNode } from 'react';

import { MediaActions } from '@ie-objects/ie-objects.types';
import { DefaultComponentProps } from '@shared/types';

export interface DynamicActionMenuProps extends DefaultComponentProps {
	children?: ReactNode;
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

	/**
	 * If url is passed, the button should be wrapped in a link tag with this url
	 * This is needed to avoid safari from blocking opening urls in a new tab
	 */
	url?: string | null;
}
