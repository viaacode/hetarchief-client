import { VisitorSpaceInfo } from '@reading-room/types';
import { DefaultComponentProps } from '@shared/types';

export interface ReadingRoomImageFormProps extends DefaultComponentProps {
	room: Pick<VisitorSpaceInfo, 'color' | 'image' | 'logo' | 'id' | 'name'>;
	renderCancelSaveButtons: (onCancel: () => void, onSave: () => void) => void;
	onSubmit?: (values: ReadingRoomImageFormState, afterSubmit?: () => void) => void;
}

export interface ReadingRoomImageFormState {
	color?: string;
	file?: File | null;
	image?: string;
}
