import { render } from '@testing-library/react';

import { SpacePreviewSpace } from '..';

import SpacePreview from './SpacePreview';
import { SPACE_PREVIEW_PROPS_MOCK } from './__mocks__/spacePreview';

const renderSpacePreview = ({ ...args }: SpacePreviewSpace, className = '') => {
	return render(
		<SpacePreview space={(SPACE_PREVIEW_PROPS_MOCK.space, args)} className={className} />
	);
};

describe('Component: <SpacePreview /> (default)', () => {
	it('Should render space name', () => {
		const name = 'my name';
		const { getByText } = renderSpacePreview({ ...SPACE_PREVIEW_PROPS_MOCK.space, name });

		const nameNode = getByText(name);

		expect(nameNode).toBeInTheDocument();
	});

	it('Should render the correct class name', () => {
		const className = 'my class';
		const { container } = renderSpacePreview({ ...SPACE_PREVIEW_PROPS_MOCK.space }, className);

		expect(container.firstChild).toHaveClass(className);
	});

	it('Should render the service description', () => {
		const serviceDescription = 'my service description';
		const { getByText } = renderSpacePreview({
			...SPACE_PREVIEW_PROPS_MOCK.space,
			serviceDescription,
		});

		const serviceDescriptionNode = getByText(serviceDescription);

		expect(serviceDescriptionNode).toBeInTheDocument();
	});

	it('Should render the card image', () => {
		const id = 'my id';
		const { getAllByAltText } = renderSpacePreview({ ...SPACE_PREVIEW_PROPS_MOCK.space, id });

		const cardImageNode = getAllByAltText(id)[0];

		expect(cardImageNode).toBeInTheDocument();
	});

	it('Should not render with insufficient props', () => {
		const image = null;
		const logo = '';
		const name = '';
		const { container } = renderSpacePreview({
			...SPACE_PREVIEW_PROPS_MOCK.space,
			image,
			logo,
			name,
		});

		expect(container.firstChild?.firstChild).not.toBeInTheDocument();
	});
});
