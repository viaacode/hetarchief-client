import { DefaultComponentProps } from '@shared/types';

export interface ReadingRoomSettingsFormProps extends DefaultComponentProps {
	initialColor?: string | null;
	renderCancelSaveButtons: (onCancel: () => void, onSave: () => void) => void;
	onSubmit?: (values: ReadingRoomFormState) => void;
}

export interface ReadingRoomFormState {
	color?: string;
	image?: unknown;
}
