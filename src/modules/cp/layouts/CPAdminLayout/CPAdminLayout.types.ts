import { type ReactNode } from 'react';

import { type DefaultComponentProps } from '@shared/types';

export interface CPAdminLayoutProps extends DefaultComponentProps {
	children?: ReactNode;
	pageTitle?: string | ReactNode;
}
