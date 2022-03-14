import { ControlType } from 'braft-editor';

export interface RichTextEditorProps {
	className?: string;
	rootClassName?: string;
	id?: string;
	initialHtml?: string;
	state?: RichEditorState;
	placeholder?: string;
	controls?: ControlType[];
	disabled?: boolean;
	onFocus?: () => void;
	onBlur?: () => void;
	onChange?: (editorState: RichEditorState) => void;
	onTab?: () => void;
	onDelete?: () => void;
	onSave?: () => void;
}

export interface RichEditorState {
	toHTML: () => string;
}
