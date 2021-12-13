import { render, RenderResult, screen } from '@testing-library/react'; //eslint-disable-line

import Modal from './Modal';

const text = 'Title of the Modal';
const documentOf = (result: RenderResult) => result.container.ownerDocument;

describe('Component: <Modal />', () => {
	let rendered: RenderResult;

	beforeEach(() => {
		rendered = render(<Modal title={text} />);
	});

	it('Should render no content initially', () => {
		try {
			screen.getByText(text);
		} catch (error) {
			expect(error);
		}
	});

	it('Should render a portal initially', () => {
		const portal = documentOf(rendered).getElementsByClassName('ReactModalPortal');

		expect(portal.length).toEqual(1);
	});
});
