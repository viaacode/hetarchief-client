import { RichEditorState } from '@meemoo/react-components';

export interface RichTextFormProps {
	renderCancelSaveButtons: (onCancel: () => void, onSave: () => void) => void;
	onSubmit?: (html: string) => void;
}

export interface RichTextFormState {
	richText?: RichEditorState;
}
