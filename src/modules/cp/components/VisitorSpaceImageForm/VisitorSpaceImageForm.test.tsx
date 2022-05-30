import { fireEvent, render } from '@testing-library/react';

import VisitorSpaceImageForm from './VisitorSpaceImageForm';
import { VISITOR_SPACE_IMAGE_FORM_MOCK } from './__mocks__/visitorSpaceImageForm';

const renderVisitorSpaceImageForm = ({ ...rest }) => {
	return render(<VisitorSpaceImageForm {...VISITOR_SPACE_IMAGE_FORM_MOCK} {...rest} />);
};

describe('Components', () => {
	describe('<VisitorSpaceImageForm />', () => {
		it('Should set the correct class name', () => {
			const className = 'custom class name';
			const { container } = renderVisitorSpaceImageForm({ className });

			expect(container.firstChild).toHaveClass(className);
		});

		it('Should show color', () => {
			const { getByDisplayValue } = renderVisitorSpaceImageForm({});

			const colorPicker = getByDisplayValue(VISITOR_SPACE_IMAGE_FORM_MOCK.room.color ?? '');

			expect(colorPicker).toBeInTheDocument();
		});

		it('Should set image', () => {
			const { getAllByAltText } = renderVisitorSpaceImageForm({});

			const image = getAllByAltText(VISITOR_SPACE_IMAGE_FORM_MOCK.room.name)[0];

			expect(image).toBeInTheDocument();
		});

		it('Should show cancel save buttons', () => {
			const { getByDisplayValue, getByText } = renderVisitorSpaceImageForm({});

			const colorPicker = getByDisplayValue(VISITOR_SPACE_IMAGE_FORM_MOCK.room.color ?? '');

			fireEvent.change(colorPicker, { target: { value: '#fff000' } });

			const cancel = getByText('Cancel');
			const save = getByText('Save');

			expect(cancel).toBeInTheDocument();
			expect(save).toBeInTheDocument();
		});
	});
});
