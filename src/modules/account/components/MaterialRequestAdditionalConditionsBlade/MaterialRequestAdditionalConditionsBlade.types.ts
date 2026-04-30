import type { MaterialRequest } from '@material-requests/types';

export interface MaterialRequestAdditionalConditionsBladeProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (conditions: string) => void;
	initialConditions?: string;
	currentMaterialRequestDetail: MaterialRequest | undefined;
	layer: number;
	currentLayer: number;
}
