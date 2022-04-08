import { BladeProps } from '@shared/components';
import { Visit } from '@shared/types';

export interface ProcessRequestBladeProps extends BladeProps {
	selected?: Visit;
	onFinish?: () => void;
}
