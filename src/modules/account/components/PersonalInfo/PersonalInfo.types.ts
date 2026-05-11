import type { MaterialRequest, MaterialRequestRequesterCapacity } from '@material-requests/types';
import type { ReactNode } from 'react';

export interface PersonalInfoProps {
	children?: ReactNode;
	materialRequests: MaterialRequest[];
	onCancel: () => void;
	onSuccess: () => void;
}

export interface PersonalInfoFormState {
	hasRequests: boolean;
	requestGroupName?: string;
	agreedToTerms: boolean;
	requesterCapacity?: MaterialRequestRequesterCapacity;
}
