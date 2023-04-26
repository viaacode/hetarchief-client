import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderResult, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { NextQueryParamProvider } from '@shared/providers/NextQueryParamProvider';
import { formatMediumDate } from '@shared/utils';

import { mockStore } from '../../../../__mocks__/store';

import MediaCard from './MediaCard';

const author = 'Author';
const date = new Date('1994-03-18');

const renderMediaCard = (card: ReactNode) => (
	<NextQueryParamProvider>
		<QueryClientProvider client={new QueryClient()}>
			<Provider store={mockStore}>{card}</Provider>
		</QueryClientProvider>
	</NextQueryParamProvider>
);

describe('Component: <MediaCard />', () => {
	let rendered: RenderResult;

	beforeEach(() => {
		rendered = render(
			renderMediaCard(
				<MediaCard
					view="grid"
					publishedOrCreatedDate={date}
					publishedBy={author}
					type="video"
				/>
			)
		);
	});

	it('Should apply the vertical orientation when rendered in grid view', () => {
		const element = rendered.container.getElementsByClassName('c-card--orientation-vertical');

		expect(element.length).toEqual(1);
	});

	it('Should apply the horizontal--at-md orientation when rendered in list view', () => {
		rendered = render(
			renderMediaCard(
				<MediaCard
					view="list"
					publishedOrCreatedDate={date}
					publishedBy={author}
					type="video"
				/>
			)
		);

		const element = rendered.container.getElementsByClassName(
			'c-card--orientation-horizontal--at-md'
		);

		expect(element.length).toEqual(1);
	});

	it('Should render the date and author in a specific format', () => {
		expect(screen.getByText(`${author} (${formatMediumDate(date)})`)).toBeDefined();
	});

	it('Should show placeholder icons based on the type of card in either view mode', () => {
		rendered = render(
			renderMediaCard(
				<MediaCard
					view="list"
					publishedOrCreatedDate={date}
					publishedBy={author}
					type="audio"
				/>
			)
		);

		expect(screen.getAllByText('no-audio')[0]).toBeDefined();
		rendered = render(
			<NextQueryParamProvider>
				<QueryClientProvider client={new QueryClient()}>
					<Provider store={mockStore}>
						<MediaCard
							view="grid"
							publishedOrCreatedDate={date}
							publishedBy={author}
							type="video"
						/>
					</Provider>
				</QueryClientProvider>
			</NextQueryParamProvider>
		);
		expect(screen.getAllByText('no-video')[0]).toBeDefined();
	});

	it('Should render key user pill if showKeyUserLabel', () => {
		rendered = render(
			renderMediaCard(
				<MediaCard
					view="list"
					publishedOrCreatedDate={date}
					publishedBy={author}
					type="video"
					showKeyUserLabel
				/>
			)
		);

		const pill = rendered.container.getElementsByClassName('c-pill')[0];

		expect(pill).toBeInTheDocument();
	});
});
