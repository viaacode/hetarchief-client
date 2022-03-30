import { ReadingRoomInfo } from '@reading-room/types';
import { DefaultComponentProps } from '@shared/types';

export interface ReadingRoomSettingsFormProps extends DefaultComponentProps {
	room: ReadingRoomInfo;
	renderCancelSaveButtons: (onCancel: () => void, onSave: () => void) => void;
	onSubmit?: (values: ReadingRoomFormState, afterSubmit?: () => void) => void;
}

export interface ReadingRoomFormState {
	color?: string;
	file?: File | null;
	image?: string;
}
