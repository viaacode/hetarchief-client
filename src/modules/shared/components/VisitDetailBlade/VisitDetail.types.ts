import { Visit } from '@shared/types';

export interface VisitDetailBladeProps {
	children?: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
	visit: Visit;
}
