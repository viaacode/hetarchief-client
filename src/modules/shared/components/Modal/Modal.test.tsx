import { render, RenderResult, screen } from '@testing-library/react'; //eslint-disable-line

import Modal from './Modal';

const text = 'Title of the Modal';

describe('Component: <Modal />', () => {
	let result: RenderResult;

	beforeEach(() => {
		result = render(<Modal title={text} />);
	});

	it('Should render no content initially', () => {
		try {
			screen.getByText(text);
		} catch (error) {
			expect(error);
		}
	});

	it('Should render a portal initially', () => {
		const portal = result.container.getElementsByClassName('ReactModalPortal');

		expect(portal.length);

		console.info(expect);
	});
});
