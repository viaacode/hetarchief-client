import { RichEditorState } from '@meemoo/react-components';

export interface RichTextFormProps {
	onSubmit?: (html: string) => void;
}

export interface RichTextFormState {
	richText?: RichEditorState;
}
