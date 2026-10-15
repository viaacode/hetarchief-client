import type { MediaActions } from '@ie-objects/ie-objects.types';
import type { DefaultComponentProps, VariantsProp } from '@shared/types';
import type { ReactNode } from 'react';

export interface DynamicActionMenuProps extends DefaultComponentProps {
	children?: ReactNode;
	actions: ActionItem[];
	onClickAction: (id: MediaActions) => void;
	id: string;
	/** Defaults to the site-wide teal primary CTA; overridden by the object detail page header */
	primaryButtonVariants?: VariantsProp;
	/** Defaults to the site-wide silver styling; overridden by the object detail page header */
	secondaryButtonVariants?: VariantsProp;
}

export interface ActionItem {
	label: string;
	id: MediaActions;
	ariaLabel: string;
	icon?: ReactNode;
	tooltip?: string;
	isPrimary?: boolean;
	customElement?: ReactNode;
	/** Called when the action moves into the dropdown, so a custom element can close what it opened */
	onHide?: () => void;
}

/** The dropdown button, or the index of the secondary button that takes over focus */
export type FocusHandoff = 'dropdown' | number;
