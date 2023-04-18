import { Visit } from '@shared/types';

export interface VisitDetailBladeProps {
	isOpen: boolean;
	onClose: () => void;
	visit: Visit;
}
