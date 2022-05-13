import { VisitorSpaceInfo } from '@reading-room/types';
import { DefaultComponentProps } from '@shared/types';

export interface WaitingPageProps extends DefaultComponentProps {
	space?: VisitorSpaceInfo | null;
	backLink?: string;
}
