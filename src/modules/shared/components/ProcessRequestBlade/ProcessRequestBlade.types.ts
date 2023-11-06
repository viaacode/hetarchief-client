import { BladeProps } from '@shared/components';
import { Visit } from '@shared/types';

export interface ProcessRequestBladeProps extends BladeProps {
	children?: React.ReactNode;
	selected?: Visit;
	onFinish?: () => void;
}
