import { fireEvent, render } from '@testing-library/react';

import ReadingRoomImageForm from './ReadingRoomImageForm';
import { READING_ROOM_IMAGE_FORM_MOCK } from './__mocks__/readingRoomImageFrom';

const renderReadingRoomImageForm = ({ ...rest }) => {
	return render(<ReadingRoomImageForm {...READING_ROOM_IMAGE_FORM_MOCK} {...rest} />);
};

describe('Components', () => {
	describe('<ReadingRoomImageForm />', () => {
		it('Should set the correct class name', () => {
			const className = 'custom class name';
			const { container } = renderReadingRoomImageForm({ className });

			expect(container.firstChild).toHaveClass(className);
		});

		it('Should show color', () => {
			const { getByDisplayValue } = renderReadingRoomImageForm({});

			const colorPicker = getByDisplayValue(READING_ROOM_IMAGE_FORM_MOCK.room.color ?? '');

			expect(colorPicker).toBeInTheDocument();
		});

		it('Should set image', () => {
			const { getAllByAltText } = renderReadingRoomImageForm({});

			const image = getAllByAltText(READING_ROOM_IMAGE_FORM_MOCK.room.name)[0];

			expect(image).toBeInTheDocument();
		});

		it('Should show cancel save buttons', () => {
			const { getByDisplayValue, getByText } = renderReadingRoomImageForm({});

			const colorPicker = getByDisplayValue(READING_ROOM_IMAGE_FORM_MOCK.room.color ?? '');

			fireEvent.change(colorPicker, { target: { value: '#fff000' } });

			const cancel = getByText('Cancel');
			const save = getByText('Save');

			expect(cancel).toBeInTheDocument();
			expect(save).toBeInTheDocument();
		});
	});
});
