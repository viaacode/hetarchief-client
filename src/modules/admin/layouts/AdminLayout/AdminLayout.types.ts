import type { DefaultComponentProps } from '@shared/types';
import type { FC, ReactNode } from 'react';

interface AdminLayoutProps extends DefaultComponentProps {
	children?: ReactNode;
	pageTitle?: string;
	bottomPadding?: boolean;
}

export type AdminLayoutComponent = FC<AdminLayoutProps> & {
	Content: FC<{ children?: ReactNode }>;
	Actions: FC<{ children?: ReactNode }>;
	FiltersLeft: FC<{ children?: ReactNode }>;
	FiltersRight: FC<{ children?: ReactNode }>;
};
