import type { MaterialRequestRequesterCapacity } from '@material-requests/types';
import type { ReactNode } from 'react';

export interface PersonalInfoProps {
	children?: ReactNode;
	hasRequests: boolean;
	mostRecentMaterialRequestName: string;
	onCancel: () => void;
	onSuccess: () => void;
}

export interface PersonalInfoFormState {
	hasRequests: boolean;
	requestGroupName?: string;
	agreedToTerms: boolean;
	requesterCapacity?: MaterialRequestRequesterCapacity;
}
