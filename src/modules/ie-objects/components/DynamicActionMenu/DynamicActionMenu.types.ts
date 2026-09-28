import type { MediaActions } from '@ie-objects/ie-objects.types';
import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface DynamicActionMenuProps extends DefaultComponentProps {
	children?: ReactNode;
	actions: ActionItem[];
	limit?: number;
	onClickAction: (id: MediaActions) => void;
	id: string;
	/**
	 * Button variants for the primary action. Defaults to the site-wide teal primary CTA.
	 * Used by the object detail page header to render its primary CTA in black instead —
	 * an explicit, single-usage exception, not a new default.
	 */
	primaryButtonVariants?: string | string[];
	/**
	 * Button variants for secondary (non-primary) actions. Defaults to the site-wide silver
	 * styling. Used by the object detail page header to render its secondary CTAs in white
	 * instead — an explicit, single-usage exception, not a new default.
	 */
	secondaryButtonVariants?: string | string[];
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
