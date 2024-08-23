import { type ReactNode } from 'react';

import { type VisitRequest } from '@shared/types/visit-request';

export interface VisitDetailBladeProps {
	children?: ReactNode;
	isOpen: boolean;
	onClose: () => void;
	visit: VisitRequest;
}
