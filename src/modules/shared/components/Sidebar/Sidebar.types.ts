import type { DefaultComponentProps } from '@shared/types';
import type { SidebarColor } from '@shared/types/sidebar';
import type { ReactNode } from 'react';

export interface SidebarProps extends DefaultComponentProps {
	children?: ReactNode;
	title?: string | ReactNode;
	heading?: ReactNode;
	/**
	 * Rendered next to the title, eg: a sort button
	 */
	titleActions?: ReactNode;
	/**
	 * Rendered below the title, eg: an explanation of the items in the sidebar
	 */
	subtitle?: ReactNode;
	color?: SidebarColor;
}
