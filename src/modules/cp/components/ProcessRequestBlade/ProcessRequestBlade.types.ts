import { BladeProps } from '@shared/components';
import { VisitInfo } from '@visits/types';

export interface ProcessRequestBladeProps extends BladeProps {
	selected?: VisitInfo;
}
