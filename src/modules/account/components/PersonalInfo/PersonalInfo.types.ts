import type { MaterialRequestRequesterCapacity } from '@material-requests/types';
import type { ReactNode } from 'react';

export interface PersonalInfoType {
	fullName: string;
	email: string;
	organisation?: string;
	requesterCapacity?: MaterialRequestRequesterCapacity;
}

export interface PersonalInfoProps {
	children?: ReactNode;
	hasRequests: boolean;
	mostRecentMaterialRequestName: string;
	onCancel: () => void;
	onSuccess: () => void;
}
