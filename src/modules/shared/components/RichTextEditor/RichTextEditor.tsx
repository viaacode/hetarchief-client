import {
	RichTextEditor as RichTextEditorComponent,
	RichTextEditorControl,
	RichTextEditorProps,
} from '@meemoo/react-components';
import React, { FC } from 'react';

const RICH_TEXT_EDITOR_OPTIONS: RichTextEditorControl[] = [
	'undo',
	'redo',
	'separator',
	'headings',
	'bold',
	'italic',
	'strike-through',
	'underline',
	'separator',
	'list-ul',
	'list-ol',
	'separator',
	'subscript',
	'superscript',
	'separator',
	'link',
	'remove-styles',
];

const RichTextEditor: FC<RichTextEditorProps> = (props) => {
	return (
		<RichTextEditorComponent
			controls={RICH_TEXT_EDITOR_OPTIONS}
			className="c-rich-text-editor"
			{...props}
		/>
	);
};

export default RichTextEditor;
