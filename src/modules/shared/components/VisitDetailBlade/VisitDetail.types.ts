import type { VisitRequest } from '@shared/types/visit-request';
import type { ReactNode } from 'react';

export interface VisitDetailBladeProps {
	children?: ReactNode;
	isOpen: boolean;
	onClose: () => void;
	visit: VisitRequest;
}
