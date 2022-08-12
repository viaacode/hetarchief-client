import { render } from '@testing-library/react';

import RichTextForm from './RichTextForm';
import { RICH_TEXT_FORM_MOCK } from './__mocks__/richTextForm';

const renderRichTextForm = ({ ...rest }) => {
	return render(<RichTextForm {...RICH_TEXT_FORM_MOCK} {...rest} />);
};

describe('Components', () => {
	describe('<RichTextForm />', () => {
		it('Should set the correct class name', () => {
			const className = 'custom class name';
			const { container } = renderRichTextForm({ className });

			expect(container.firstChild).toHaveClass(className);
		});

		it('Should show initialHTML', () => {
			const { getByText } = renderRichTextForm({});

			const content = getByText(RICH_TEXT_FORM_MOCK.editor?.initialHtml ?? '');

			expect(content).toBeInTheDocument();
		});
	});
});
