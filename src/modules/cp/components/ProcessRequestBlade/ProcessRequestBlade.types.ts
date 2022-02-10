import { RequestTableRow } from '@cp/const/requests.const';
import { BladeProps } from '@shared/components';

export interface ProcessRequestBladeProps extends BladeProps {
	selected?: RequestTableRow;
}
