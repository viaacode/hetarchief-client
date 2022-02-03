import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface SidebarProps extends DefaultComponentProps {
	title?: string;
	heading?: ReactNode;
}
