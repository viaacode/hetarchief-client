import { render, RenderResult, screen } from '@testing-library/react'; //eslint-disable-line

import Card from './Card';

const text = 'The quick brown fox jumps over the lazy dog';

describe('Component: <Card />', () => {
	let rendered: RenderResult;

	beforeEach(() => {
		rendered = render(<Card edge={Card.defaultProps?.edge} title={text} />);
	});

	it('Should show a title', () => {
		const title = screen.getByText(text);

		expect(title).toBeDefined();
	});
});
