import type { IconName } from '@shared/components/Icon';
import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface BladeContentProps
	extends BladeHeaderProps,
		BladeFooterProps,
		DefaultComponentProps {
	id: string;
	children?: ReactNode;
	closable?: boolean;
	onClose?: () => void;
}

export interface BladeHeaderProps {
	/**
	 * Blade should be 90% instead of the default small size
	 */
	isWideBlade?: boolean;
	/**
	 * The actual title <br/>
	 * Will always be shown
	 */
	title: string;
	/**
	 * Should the actual title be a bit smaller since we are using a bigger subtitle?
	 */
	showTitleSmaller?: boolean;
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
	/**
	 * Show the header as scrolled by default
	 */
	showHeaderBackgroundByDefault?: boolean;
}

export interface BladeFooterProps {
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
	footerButtons: BladeFooterButtonProps;
	/**
	 * Set this to true if you want to ignore all default logic in regard to the footer
	 * ARE YOU SURE YOU WANT TO DO THIS?????
	 * This should only be used in very rare cases
	 */
	ignoreFooterButtons?: boolean;
	/**
	 * The custom footer used instead of the footer buttons.
	 * ARE YOU SURE YOU WANT TO DO THIS?????
	 * This should only be used in very rare cases
	 */
	customFooter?: ReactNode;
	/**
	 * When a custom footer is used, sometimes you want to be able to remove the padding from the footer
	 * This will only applied to the footer when there is a customFooter set
	 */
	removePaddingForCustomFooter?: boolean;
	/**
	 * Is the footer sticky? Will be true by default
	 */
	stickyFooter?: boolean;
}

export interface BladeProps extends Omit<BladeContentProps, 'closable'> {
	isOpen: boolean;
	ariaLabel: string;

	// manager types
	layer?: number;
	isManaged?: boolean;
	currentLayer?: number;
}

export interface BladeFooterButton {
	label: string;
	mobileLabel: string; // The label used on mobile
	title?: string;
	ariaLabel?: string;
	type: 'primary' | 'secondary';
	enforceSecondary?: boolean; // Only used when we have just 1 button, and need to be secondary
	onClick?: () => void;
	disabled?: boolean;
	href?: string; // Determines if this is a link and will be rendered as such
	externalLink?: boolean; // Determines if the link should open in a new window or not
	icon?: IconName; // Should use only in specific cases
}

export type BladeFooterButtonProps = [BladeFooterButton, BladeFooterButton?] | undefined;
