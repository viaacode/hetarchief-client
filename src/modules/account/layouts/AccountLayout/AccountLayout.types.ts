import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface AccountLayoutProps extends DefaultComponentProps {
	children?: ReactNode;
	pageTitle?: string | ReactNode;
}
