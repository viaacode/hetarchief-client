import { DefaultComponentProps } from '@shared/types';

import { VisitorSpaceInfo } from '../../types';

export interface WaitingPageProps extends DefaultComponentProps {
	children?: React.ReactNode;
	space?: VisitorSpaceInfo | null;
	backLink?: string;
}
