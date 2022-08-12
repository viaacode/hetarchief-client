import { FormControlProps, RichEditorState, RichTextEditorProps } from '@meemoo/react-components';

import { DefaultComponentProps } from '@shared/types';

export interface RichTextFormProps extends DefaultComponentProps {
	formControl?: Partial<Omit<FormControlProps, 'className'>>;
	editor?: Partial<RichTextEditorProps>;
	renderCancelSaveButtons: (onCancel: () => void, onSave: () => void) => void;
	onSubmit?: (html: string, afterSubmit: () => void) => void;
	onUpdate?: (html: string) => void;
}

export interface RichTextFormState {
	richText?: RichEditorState;
}
