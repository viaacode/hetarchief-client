import { type ReactNode } from 'react';

import { type MaterialRequestRequesterCapacity } from '@material-requests/types';

export interface PersonalInfoType {
	fullName: string;
	email: string;
	organisation?: string;
	requesterCapacity?: MaterialRequestRequesterCapacity;
}

export interface PersonalInfoBladeBladeProps {
	children?: ReactNode;
	isOpen: boolean;
	onClose: () => void;
	personalInfo: PersonalInfoType;
	layer: number;
	currentLayer: number;
	refetch: () => void;
}
