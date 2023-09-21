import { DefaultComponentProps } from '@shared/types';

export interface VisitorSpaceImageFormProps extends DefaultComponentProps {
	room: {
		id: string;
		name: string;
		color: string | null;
		logo: string;
		image: string | null;
	};
	renderCancelSaveButtons: (onCancel: () => void, onSave: () => void) => void;
	onSubmit?: (values: VisitorSpaceImageFormState, afterSubmit?: () => void) => void;
	onUpdate?: (values: VisitorSpaceImageFormState) => void;
}

export interface VisitorSpaceImageFormState {
	color?: string;
	file?: File | null;
	image?: string;
}
