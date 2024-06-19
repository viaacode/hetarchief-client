import { type ReactNode } from 'react';

import { type AccessType, type FormBladeProps } from '@shared/types';

import { type ProcessRequestBladeProps } from '../ProcessRequestBlade/ProcessRequestBlade.types';

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
