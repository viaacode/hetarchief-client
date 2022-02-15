import { RequestTableRow } from '@cp/types';
import { BladeProps } from '@shared/components';

export interface ProcessRequestBladeProps extends BladeProps {
	selected?: RequestTableRow;
}
