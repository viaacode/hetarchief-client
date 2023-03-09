import { render, RenderResult, screen } from '@testing-library/react';

import { IdentifiableMediaCard } from '../MediaCard';

import MediaCardList from './MediaCardList';
import { gridData } from './__mocks__/media-card-list';

describe('Component: <MediaCardList />', () => {
	const data: IdentifiableMediaCard[] = gridData;
	let rendered: RenderResult | undefined;

	beforeEach(() => {
		rendered = undefined;
	});

	it('Should be able to show children that are always visible', () => {
		const child = '<child>';

		rendered = render(<MediaCardList sidebar={child} view="grid" items={data} />);

		expect(screen.getByText(child)).toBeDefined();
	});

	it('Should apply the vertical orientation when rendered in grid view', () => {
		rendered = render(<MediaCardList view="grid" items={data} />);

		const element = rendered.container.getElementsByClassName('c-card--orientation-vertical');

		expect(element.length).toBeGreaterThan(0);
	});

	it('Should apply the horizontal--at-md orientation when rendered in list view', () => {
		rendered = render(
			<MediaCardList
				view="list"
				items={data.map((item) => {
					return {
						...item,
						view: 'list',
					};
				})}
			/>
		);

		const element = rendered.container.getElementsByClassName(
			'c-card--orientation-horizontal--at-md'
		);

		expect(element.length).toBeGreaterThan(0);
	});
});
