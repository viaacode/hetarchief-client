import type { MaterialRequest } from '@material-requests/types';

export interface MaterialRequestAdditionalConditionsResolutionBladeProps {
	isOpen: boolean;
	onClose: () => void;
	onBack?: () => void;
	onSubmit?: (conditions: string) => void;
	currentMaterialRequestDetail: MaterialRequest | undefined;
	conditionsAccepted: boolean;
	layer: number;
	currentLayer: number;
}
