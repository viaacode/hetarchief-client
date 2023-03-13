import { ReactNode } from 'react';

import { AccessType, FormBladeProps } from '@shared/types';

import { ProcessRequestBladeProps } from '../ProcessRequestBlade';

export type ApproveRequestBladeProps = FormBladeProps<ApproveRequestFormState> &
	ProcessRequestBladeProps & {
		title?: string | ReactNode;
		approveButtonLabel?: string;
		successTitle?: string | ReactNode;
		successDescription?: string | ReactNode;
	};

export interface ApproveRequestFormState {
	accessFrom: Date;
	accessTo: Date;
	accessRemark?: string;
	accessType: {
		type: AccessType;
		folderIds: string[];
	};
}
