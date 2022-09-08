import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface AccountLayoutProps extends DefaultComponentProps {
	pageTitle?: string | ReactNode;
}
