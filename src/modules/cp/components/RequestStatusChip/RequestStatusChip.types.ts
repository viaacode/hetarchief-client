import { DefaultComponentProps } from '@shared/types';
import { VisitStatus } from '@visits/types';

export interface RequestStatusChipProps extends DefaultComponentProps {
	status: VisitStatus;
}
