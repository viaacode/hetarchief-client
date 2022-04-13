import { BladeProps, VisitSummaryType } from '@shared/components';
import { Visit } from '@shared/types';

// TODO: add spaceDescription
export interface ProcessVisitBladeProps extends BladeProps {
	selected?: VisitSummaryType & Pick<Visit, 'status'>;
	onFinish?: () => void;
}
