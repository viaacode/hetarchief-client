import { type ReactNode } from 'react';

import { type DefaultComponentProps } from '@shared/types';

export interface AccountLayoutProps extends DefaultComponentProps {
	children?: ReactNode;
	pageTitle?: string | ReactNode;
}
