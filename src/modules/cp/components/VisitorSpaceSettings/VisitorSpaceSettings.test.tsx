import { render } from '@testing-library/react';

import VisitorSpaceSettings from './VisitorSpaceSettings';
import { VISITOR_SPACE_MOCK } from './__mocks__/visitorSpaceSettings';

const renderVisitorSpaceSettings = ({
	room = VISITOR_SPACE_MOCK,
	refetch = () => null,
	...rest
}) => {
	return render(<VisitorSpaceSettings room={room} refetch={refetch} {...rest} />);
};

describe('Components', () => {
	describe('<VisitorSpaceSettings />', () => {
		it('Should set the correct class name', () => {
			const className = 'custom class name';
			const { container } = renderVisitorSpaceSettings({ className });

			expect(container.firstChild).toHaveClass(className);
		});

		it('Should show reading room color', () => {
			const { getByDisplayValue } = renderVisitorSpaceSettings({});

			const color = getByDisplayValue(VISITOR_SPACE_MOCK.color ?? '');

			expect(color).toBeInTheDocument();
		});

		it('Should show reading room image', () => {
			const { getByAltText } = renderVisitorSpaceSettings({});

			const image = getByAltText(VISITOR_SPACE_MOCK.name);

			expect(image).toBeInTheDocument();
		});

		it('Should show reading room description', () => {
			const { getByText } = renderVisitorSpaceSettings({});

			const description = getByText(VISITOR_SPACE_MOCK.description ?? '');

			expect(description).toBeInTheDocument();
		});

		it('Should show reading room serviceDescription', () => {
			const { getByText } = renderVisitorSpaceSettings({});

			const serviceDescription = getByText(VISITOR_SPACE_MOCK.serviceDescription ?? '');

			expect(serviceDescription).toBeInTheDocument();
		});
	});
});
