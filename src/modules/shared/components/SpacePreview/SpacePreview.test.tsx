import { render } from '@testing-library/react';

import type { SpacePreviewSpace } from '@shared/components/SpacePreview/SpacePreview.types';

import '@testing-library/jest-dom';
import SpacePreview from './SpacePreview';
import { SPACE_PREVIEW_PROPS_MOCK } from './__mocks__/spacePreview';

const renderSpacePreview = ({ ...args }: SpacePreviewSpace, className = '') => {
	return render(
		<SpacePreview
			visitorSpace={{ ...SPACE_PREVIEW_PROPS_MOCK.visitorSpace, ...args }}
			className={className}
		/>
	);
};

describe('Component: <SpacePreview /> (default)', () => {
	it('Should render space name', () => {
		const name = 'my name';
		const { getByText } = renderSpacePreview({
			...SPACE_PREVIEW_PROPS_MOCK.visitorSpace,
			name,
		});

		const nameNode = getByText(name);

		expect(nameNode).toBeInTheDocument();
	});

	it('Should render the correct class name', () => {
		const className = 'my class';
		const { container } = renderSpacePreview(
			{ ...SPACE_PREVIEW_PROPS_MOCK.visitorSpace },
			className
		);

		expect(container.firstChild).toHaveClass(className);
	});

	it('Should render the service description', () => {
		const serviceDescriptionNl = 'my service description';
		const { getByText } = renderSpacePreview({
			...SPACE_PREVIEW_PROPS_MOCK.visitorSpace,
			serviceDescriptionNl,
		});

		const serviceDescriptionNode = getByText(serviceDescriptionNl);

		expect(serviceDescriptionNode).toBeInTheDocument();
	});

	it('Should render the card image', () => {
		const id = 'my id';
		const { getAllByAltText } = renderSpacePreview({
			...SPACE_PREVIEW_PROPS_MOCK.visitorSpace,
			id,
		});

		const cardImageNode = getAllByAltText(id)[0];

		expect(cardImageNode).toBeInTheDocument();
	});

	it('Should not render with insufficient props', () => {
		const image = null;
		const logo = '';
		const name = '';
		const { container } = renderSpacePreview({
			...SPACE_PREVIEW_PROPS_MOCK.visitorSpace,
			image,
			logo,
			name,
		});

		expect(container.firstChild?.firstChild).not.toBeInTheDocument();
	});
});
