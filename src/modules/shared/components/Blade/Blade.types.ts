import type { IconName } from '@shared/components/Icon';
import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface BladeProps extends DefaultComponentProps {
	children?: ReactNode;
	footer?: ReactNode;
	isOpen: boolean;
	hideOverlay?: boolean;
	hideCloseButton?: boolean;
	showCloseButtonOnTop?: boolean;
	showBackButton?: boolean;
	onClose?: () => void;
	// manager types
	layer?: number;
	isManaged?: boolean;
	currentLayer?: number;
	renderTitle?: (props: Pick<HTMLElement, 'id' | 'className'>) => ReactNode;
	id: string;
	extraWide?: boolean;
	headerBackground?: 'white' | 'platinum';
	stickyFooter?: boolean;
}

export interface BladeNewProps extends DefaultComponentProps {
	id: string;
	children?: ReactNode;
	isOpen: boolean;
	onClose?: () => void;

	// Title props
	/**
	 * Small text above the title <br/>
	 * When set will make the blade extra wide <br/>
	 * Will be hidden on mobile
	 */
	wideBladeTitle?: string;
	/**
	 * The actual title <br/>
	 * Will always be shown
	 */
	title: string;
	/**
	 * All elements needed to be below the title <br/>
	 * Will be sticky
	 */
	stickySubtitle?: ReactNode;
	/**
	 * Additional elements below the title <br/>
	 * Will be sticky on desktop but not on Mobile
	 */
	subtitle?: ReactNode;

	// Footer props
	/**
	 * Show red error message in the footer that there are errors in the form
	 */
	isBladeInvalid?: boolean;
	/**
	 * Depending on de setting of both buttons, the blade will set certain styling <br/>
	 * Primary buttons will <br/>
	 *   - always be rendered first - on top (desktop) or right (mobile)
	 *   - black if they are the only primary
	 *
	 * Secondary buttons will <br/>
	 *   - always be rendered last - bottom (desktop) or left (mobile)
	 *   - text only (no exceptions)
	 *
	 * General rules
	 *   - Only 1 button:
	 *     - the type of the button will be ignored and set to primary unless enforceType is set
	 *   - 2 primary buttons:
	 *     - the order of the buttons will be kept
	 *     - 1 will be green
	 *     - 1 will be red
	 *   - 2 secondary buttons:
	 *     - the order of the buttons will be kept
	 *     - the type of the first button will be ignored and set to primary
	 *   - 1 primary and 1 secondary button:
	 *     - the order of the buttons will be ignored
	 */
	footerButtons: BladeFooterProps;
	/**
	 * Is the footer sticky? Will be true by default
	 */
	stickyFooter?: boolean;

	// manager types
	layer?: number;
	isManaged?: boolean;
	currentLayer?: number;
}

export interface BladeFooterButton {
	label: string;
	title?: string;
	ariaLabel?: string;
	type: 'primary' | 'secondary';
	enforceSecondary?: boolean; // Only used when we have just 1 button, and need to be secondary
	onClick?: () => void;
	disabled?: boolean;
	href?: string; // Determines if this is a link and will be rendered as such
	icon?: IconName; // Should use only in specific cases
}

export type BladeFooterProps = [BladeFooterButton, BladeFooterButton?];
