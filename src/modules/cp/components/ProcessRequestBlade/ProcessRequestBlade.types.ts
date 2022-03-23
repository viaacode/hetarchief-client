import { BladeProps } from '@shared/components';
import { VisitInfo } from '@shared/types';

export interface ProcessRequestBladeProps extends BladeProps {
	selected?: VisitInfo;
	onFinish?: () => void;
}
