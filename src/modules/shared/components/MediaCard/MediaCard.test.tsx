import { render, RenderResult, screen } from '@testing-library/react';

import { formatMediumDate } from '@shared/utils';

import MediaCard from './MediaCard';

const author = 'Author';
const date = new Date('1994-03-18');

describe('Component: <MediaCard />', () => {
	let rendered: RenderResult;

	beforeEach(() => {
		rendered = render(
			<MediaCard view="grid" publishedAt={date} publishedBy={author} type="video" />
		);
	});

	it('Should apply the vertical orientation when rendered in grid view', () => {
		const element = rendered.container.getElementsByClassName('c-card--orientation-vertical');

		expect(element.length).toEqual(1);
	});

	it('Should apply the horizontal--at-md orientation when rendered in list view', () => {
		rendered = render(<MediaCard view="list" type="video" />);

		const element = rendered.container.getElementsByClassName(
			'c-card--orientation-horizontal--at-md'
		);

		expect(element.length).toEqual(1);
	});

	it('Should render the date and author in a specific format', () => {
		expect(screen.getByText(`${author} (${formatMediumDate(date)})`)).toBeDefined();
	});

	it('Should show placeholder icons based on the type of card in either view mode', () => {
		// rendered = render(<MediaCard view="list" type="audio" />);
		// expect(screen.getAllByText('no-audio')[0]).toBeDefined();
		// rendered = render(<MediaCard view="grid" type="video" />);
		// expect(screen.getAllByText('no-video')[0]).toBeDefined();
	});

	it('Should render key user pill if isKeyUser', () => {
		rendered = render(<MediaCard view="list" type="video" isKeyUser />);

		const iconElement = rendered.container
			.getElementsByClassName('c-media-card--key-user-pill')
			.item(0);

		expect(iconElement).toBeInTheDocument();
	});
});
