import { RichEditorState } from '@meemoo/react-components';

import { DefaultComponentProps } from '@shared/types';

export interface RichTextFormProps extends DefaultComponentProps {
	initialHTML?: string;
	renderCancelSaveButtons: (onCancel: () => void, onSave: () => void) => void;
	onSubmit?: (html: string) => void;
}

export interface RichTextFormState {
	richText?: RichEditorState;
}
