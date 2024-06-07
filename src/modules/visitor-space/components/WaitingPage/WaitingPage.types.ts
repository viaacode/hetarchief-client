import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

import { VisitorSpaceInfo } from '../../types';

export interface WaitingPageProps extends DefaultComponentProps {
	children?: ReactNode;
	visitorSpace?: VisitorSpaceInfo | null;
	backLink?: string;
}
