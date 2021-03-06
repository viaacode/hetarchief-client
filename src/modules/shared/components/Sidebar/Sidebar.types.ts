import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';
import { SidebarColor } from '@shared/types/sidebar';

export interface SidebarProps extends DefaultComponentProps {
	title?: string;
	heading?: ReactNode;
	color?: SidebarColor;
}
