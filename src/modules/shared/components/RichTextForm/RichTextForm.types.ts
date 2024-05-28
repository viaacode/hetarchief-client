import {
	FormControlProps,
	RichEditorState,
	RichTextEditorControl,
	RichTextEditorProps,
} from '@meemoo/react-components';
import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface RichTextFormProps extends DefaultComponentProps {
	children?: React.ReactNode;
	formControl?: Partial<Omit<FormControlProps, 'className'>>;
	editor?: Partial<RichTextEditorProps>;
	renderCancelSaveButtons: (onCancel: () => void, onSave: () => void) => ReactNode | null;
	onSubmit?: (html: string, afterSubmit: () => void) => void;
	onUpdate?: (html: string) => void;
}

export interface RichTextFormState {
	richText?: RichEditorState;
}

export const RICH_TEXT_EDITOR_OPTIONS: RichTextEditorControl[] = [
	'fullscreen',
	'separator',
	'undo',
	'redo',
	'separator',
	'headings',
	'separator',
	'bold',
	'underline',
	'italic',
	'separator',
	'link',
	'separator',
	'list-ul',
	'list-ol',
];
