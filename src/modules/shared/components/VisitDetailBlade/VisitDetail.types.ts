import { type ReactNode } from 'react';

import { type Visit } from '@shared/types/visit';

export interface VisitDetailBladeProps {
	children?: ReactNode;
	isOpen: boolean;
	onClose: () => void;
	visit: Visit;
}
