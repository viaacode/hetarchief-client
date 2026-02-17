import type { MediaActions } from '@ie-objects/ie-objects.types';
import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface DynamicActionMenuProps extends DefaultComponentProps {
	children?: ReactNode;
	actions: ActionItem[];
	limit?: number;
	onClickAction: (id: MediaActions) => void;
	id: string;
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
