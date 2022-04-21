import { render } from '@testing-library/react';

import ReadingRoomSettings from './ReadingRoomSettings';
import { VISITOR_SPACE_MOCK } from './__mocks__/readingRoomSettings';

const renderReadingRoomSettings = ({
	room = VISITOR_SPACE_MOCK,
	refetch = () => null,
	...rest
}) => {
	return render(<ReadingRoomSettings room={room} refetch={refetch} {...rest} />);
};

describe('Components', () => {
	describe('<ReadingRoomSettings />', () => {
		it('Should set the correct class name', () => {
			const className = 'custom class name';
			const { container } = renderReadingRoomSettings({ className });

			expect(container.firstChild).toHaveClass(className);
		});

		it('Should show reading room color', () => {
			const { getByDisplayValue } = renderReadingRoomSettings({});

			const color = getByDisplayValue(VISITOR_SPACE_MOCK.color ?? '');

			expect(color).toBeInTheDocument();
		});

		it('Should show reading room image', () => {
			const { getByAltText } = renderReadingRoomSettings({});

			const image = getByAltText(VISITOR_SPACE_MOCK.name);

			expect(image).toBeInTheDocument();
		});

		it('Should show reading room description', () => {
			const { getByText } = renderReadingRoomSettings({});

			const description = getByText(VISITOR_SPACE_MOCK.description ?? '');

			expect(description).toBeInTheDocument();
		});

		it('Should show reading room serviceDescription', () => {
			const { getByText } = renderReadingRoomSettings({});

			const serviceDescription = getByText(VISITOR_SPACE_MOCK.serviceDescription ?? '');

			expect(serviceDescription).toBeInTheDocument();
		});
	});
});
