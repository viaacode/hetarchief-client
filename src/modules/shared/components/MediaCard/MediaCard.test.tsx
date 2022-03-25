import { render, RenderResult, screen } from '@testing-library/react';

import { ROUTES } from '@shared/const';

import MediaCard from './MediaCard';
import { formatDate } from './MediaCard.utils';

const author = 'Author';
const now = new Date();

describe('Component: <MediaCard />', () => {
	let rendered: RenderResult;

	beforeEach(() => {
		rendered = render(
			<MediaCard
				view="grid"
				publishedAt={now}
				publishedBy={author}
				type="video"
				detailLink={`/${ROUTES.spaces}/leeszaal-8/b1f60efadf5243d78c7c91512adaa6cefe52723ff35848268894c7861d852b79c3609554ce4f43d182ca36be53584d60`}
			/>
		);
	});

	it('Should apply the vertical orientation when rendered in grid view', () => {
		const element = rendered.container.getElementsByClassName('c-card--orientation-vertical');

		expect(element.length).toEqual(1);
	});

	it('Should apply the horizontal--at-md orientation when rendered in list view', () => {
		rendered = render(
			<MediaCard
				view="list"
				type="video"
				detailLink={`/${ROUTES.spaces}/leeszaal-8/b1f60efadf5243d78c7c91512adaa6cefe52723ff35848268894c7861d852b79c3609554ce4f43d182ca36be53584d60`}
			/>
		);

		const element = rendered.container.getElementsByClassName(
			'c-card--orientation-horizontal--at-md'
		);

		expect(element.length).toEqual(1);
	});

	it('Should render the date and author in a specific format', () => {
		expect(screen.getByText(`${author} (${formatDate(now)})`)).toBeDefined();
	});

	it('Should show placeholder icons based on the type of card in either view mode', () => {
		rendered = render(
			<MediaCard
				view="list"
				type="audio"
				detailLink={`/${ROUTES.spaces}/leeszaal-8/b1f60efadf5243d78c7c91512adaa6cefe52723ff35848268894c7861d852b79c3609554ce4f43d182ca36be53584d60`}
			/>
		);
		expect(screen.getAllByText('no-audio')[0]).toBeDefined();

		rendered = render(
			<MediaCard
				view="grid"
				type="video"
				detailLink={`/${ROUTES.spaces}/leeszaal-8/b1f60efadf5243d78c7c91512adaa6cefe52723ff35848268894c7861d852b79c3609554ce4f43d182ca36be53584d60`}
			/>
		);
		expect(screen.getAllByText('no-video')[0]).toBeDefined();
	});
});
