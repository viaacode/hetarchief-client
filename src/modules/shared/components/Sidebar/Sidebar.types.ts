import { type ReactNode } from 'react';

import { type DefaultComponentProps } from '@shared/types';
import { type SidebarColor } from '@shared/types/sidebar';

export interface SidebarProps extends DefaultComponentProps {
	children?: ReactNode;
	title?: string | ReactNode;
	heading?: ReactNode;
	color?: SidebarColor;
}
