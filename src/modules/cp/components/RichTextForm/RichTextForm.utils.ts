import { RichEditorState } from '@meemoo/react-components';

export const isEqualHtml = (a?: RichEditorState, b?: RichEditorState): boolean => {
	if (!a || !b) {
		return true;
	}

	return a.toHTML() === b.toHTML();
};
