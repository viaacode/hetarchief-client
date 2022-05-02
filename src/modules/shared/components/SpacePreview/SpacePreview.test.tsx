import { fireEvent, render } from '@testing-library/react';

import SpacePreview from './SpacePreview';
import { SPACE_PREVIEW_PROPS_MOCK } from './__mocks__/spacePreview';

const renderSpacePreview = ({ ...args }) => {
	return render(<SpacePreview {...SPACE_PREVIEW_PROPS_MOCK} {...args} />);
};

describe('Component: <SpacePreview /> (default)', () => {
	it('Should render space name', () => {
		const spaceName = 'my spaceName';
		const { getByText } = renderSpacePreview({ spaceName });

		const spaceNameNode = getByText(spaceName);

		expect(spaceNameNode).toBeInTheDocument();
	});

	it('Should render the correct class name', () => {
		const className = 'my class';
		const { container } = renderSpacePreview({ className });

		expect(container.firstChild).toHaveClass(className);
	});

	it('Should render the service description', () => {
		const spaceServiceDescription = 'my service description';
		const { getByText } = renderSpacePreview({ spaceServiceDescription });

		const spaceServiceDescriptionNode = getByText(spaceServiceDescription);

		expect(spaceServiceDescriptionNode).toBeInTheDocument();
	});

	it('Should render the card image', () => {
		const spaceId = 'my id';
		const { getAllByAltText } = renderSpacePreview({ spaceId });

		const cardImageNode = getAllByAltText(spaceId)[0];

		expect(cardImageNode).toBeInTheDocument();
	});

	it('Should not render with insufficient props', () => {
		const spaceImage = undefined;
		const spaceLogo = undefined;
		const spaceName = undefined;
		const { container } = renderSpacePreview({ spaceImage, spaceLogo, spaceName });

		expect(container.firstChild?.firstChild).not.toBeInTheDocument();
	});
});
