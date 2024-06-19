import { type ReactNode } from 'react';

import { type DefaultComponentProps } from '@shared/types';

import { type VisitorSpaceInfo } from '../../types';

export interface WaitingPageProps extends DefaultComponentProps {
	children?: ReactNode;
	visitorSpace?: VisitorSpaceInfo | null;
	backLink?: string;
}
