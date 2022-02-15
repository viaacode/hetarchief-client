import { FormBladeProps } from '@shared/types';

import { ProcessRequestBladeProps } from '../ProcessRequestBlade';

export type ApproveRequestBladeProps = FormBladeProps<ApproveRequestFormState> &
	ProcessRequestBladeProps;

export interface ApproveRequestFormState {
	accessFrom?: Date;
	accessTo?: Date;
	accessRemark?: string;
}
