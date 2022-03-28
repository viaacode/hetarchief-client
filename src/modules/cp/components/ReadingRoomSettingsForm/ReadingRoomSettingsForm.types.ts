import { DefaultComponentProps } from '@shared/types';

export interface ReadingRoomSettingsFormProps extends DefaultComponentProps {
	initialColor?: string | null;
	initialImage?: string | null;
	renderCancelSaveButtons: (onCancel: () => void, onSave: () => void) => void;
	onSubmit?: (values: ReadingRoomFormState) => void;
}

export interface ReadingRoomFormState {
	color?: string;
	file?: File | null;
	image?: string;
}
