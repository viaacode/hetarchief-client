export interface ReadingRoomSettingsFormProps {
	renderCancelSaveButtons: (onCancel: () => void, onSave: () => void) => void;
	onSubmit?: (values: ReadingRoomFormState) => void;
}

export interface ReadingRoomFormState {
	color: string;
	image?: unknown;
}
