import { FormBladeProps } from '@shared/types';

import { ProcessRequestBladeProps } from '../ProcessRequestBlade';

export type ApproveRequestBladeProps = FormBladeProps<ApproveRequestFormState> &
	ProcessRequestBladeProps & {
		title?: string;
		approveButtonLabel?: string;
		successTitle?: string;
		successDescription?: string;
	};

export interface ApproveRequestFormState {
	accessFrom?: Date;
	accessTo?: Date;
	accessRemark?: string;
}
