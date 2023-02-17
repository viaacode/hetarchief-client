import { FC } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface AdminLayoutProps extends DefaultComponentProps {
	pageTitle?: string;
	bottomPadding?: boolean;
}

export type AdminLayoutComponent = FC<AdminLayoutProps> & {
	Content: FC;
	Actions: FC;
	FiltersLeft: FC;
	FiltersRight: FC;
};
