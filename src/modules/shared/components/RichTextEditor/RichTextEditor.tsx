import {
	RichTextEditor as RichTextEditorComponent,
	RichTextEditorControl,
	RichTextEditorProps,
} from '@meemoo/react-components';
import React, { FC } from 'react';

const RICH_TEXT_EDITOR_OPTIONS: RichTextEditorControl[] = [
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

const RichTextEditor: FC<RichTextEditorProps> = (props) => {
	return (
		<RichTextEditorComponent
			controls={RICH_TEXT_EDITOR_OPTIONS}
			className="c-rich-text-editor"
			{...props}
			braft={{
				...props?.braft,
				draftProps: {
					ariaAutoComplete: false,
					ariaMultiline: true,
					...props?.braft?.draftProps,
				},
			}}
		/>
	);
};

export default RichTextEditor;
