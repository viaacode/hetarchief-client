import { documentOf } from '@meemoo/react-components';
import { render, RenderResult, screen } from '@testing-library/react';

import MediaCard from './MediaCard';
import { formatDate } from './MediaCard.utils';

const author = 'Author';
const now = new Date();

describe('Component: <MediaCard />', () => {
	let rendered: RenderResult;

	beforeEach(() => {
		rendered = render(<MediaCard view="grid" published_at={now} published_by={author} />);
	});

	it('Should apply the vertical orientation when rendered in grid view', () => {
		const element = documentOf(rendered).getElementsByClassName('c-card--orientation-vertical');

		expect(element.length).toEqual(1);
	});

	it('Should apply the horizontal orientation when rendered in list view', () => {
		rendered = render(<MediaCard view="list" />);

		const element = documentOf(rendered).getElementsByClassName(
			'c-card--orientation-horizontal'
		);

		expect(element.length).toEqual(1);
	});

	it('Should render the date and author in a specific format', () => {
		expect(screen.getByText(`${author} (${formatDate(now)})`)).toBeDefined();
	});

	it('Should show placeholder icons based on the type of card in either view mode', () => {
		rendered = render(<MediaCard view="list" type="audio" />);
		expect(screen.getByText('no-audio')).toBeDefined();

		rendered = render(<MediaCard view="grid" type="video" />);
		expect(screen.getByText('no-video')).toBeDefined();
	});
});
