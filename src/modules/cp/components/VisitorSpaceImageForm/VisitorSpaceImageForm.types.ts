import { DefaultComponentProps } from '@shared/types';
import { VisitorSpaceInfo } from '@visitor-space/types';

export interface VisitorSpaceImageFormProps extends DefaultComponentProps {
	room: Pick<VisitorSpaceInfo, 'color' | 'image' | 'logo' | 'id' | 'name'>;
	renderCancelSaveButtons: (onCancel: () => void, onSave: () => void) => void;
	onSubmit?: (values: VisitorSpaceImageFormState, afterSubmit?: () => void) => void;
	onUpdate?: (values: VisitorSpaceImageFormState) => void;
}

export interface VisitorSpaceImageFormState {
	color?: string;
	file?: File | null;
	image?: string;
}
