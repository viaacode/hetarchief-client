import { DefaultComponentProps } from '@shared/types';

import { VisitorSpaceInfo } from '../../types';

export interface WaitingPageProps extends DefaultComponentProps {
	space?: VisitorSpaceInfo | null;
	backLink?: string;
}
