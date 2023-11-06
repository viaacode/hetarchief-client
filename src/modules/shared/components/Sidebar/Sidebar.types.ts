import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';
import { SidebarColor } from '@shared/types/sidebar';

export interface SidebarProps extends DefaultComponentProps {
	children?: React.ReactNode;
	title?: string | ReactNode;
	heading?: ReactNode;
	color?: SidebarColor;
}
