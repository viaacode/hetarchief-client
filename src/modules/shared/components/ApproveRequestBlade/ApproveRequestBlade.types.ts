import type { FormBladeProps } from '@shared/types/blade';
import type { AccessType } from '@shared/types/visit-request';
import type { ReactNode } from 'react';

import type { ProcessRequestBladeProps } from '../ProcessRequestBlade/ProcessRequestBlade.types';

export type ApproveRequestBladeProps = FormBladeProps<ApproveRequestFormState> &
	ProcessRequestBladeProps & {
		title: string;
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
		folderIds: string[] | undefined;
	};
}
