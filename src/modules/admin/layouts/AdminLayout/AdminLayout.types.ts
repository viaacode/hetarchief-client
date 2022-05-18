import { FC, ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface AdminLayoutProps extends DefaultComponentProps {
	pageTitle: ReactNode;
}

export type AdminLayoutComponent = FC<AdminLayoutProps> & {
	Content: FC;
	Actions: FC;
	FiltersLeft: FC;
	FiltersRight: FC;
};
