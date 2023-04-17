import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { NextQueryParamProvider } from '@shared/providers/NextQueryParamProvider';

import { mockStore } from '../../../../__mocks__/store';
import { IdentifiableMediaCard } from '../MediaCard';

import MediaCardList from './MediaCardList';
import { MediaCardListProps } from './MediaCardList.types';
import { gridData } from './__mocks__/media-card-list';

const renderMediaCardList = (args: Partial<MediaCardListProps>, list?: boolean) => {
	const child = '<child>';
	const data: IdentifiableMediaCard[] = gridData;

	return render(
		<NextQueryParamProvider>
			<QueryClientProvider client={new QueryClient()}>
				<Provider store={mockStore}>
					<MediaCardList
						sidebar={child}
						view={list ? 'list' : 'grid'}
						items={
							list
								? data.map((item) => {
										return {
											...item,
											view: 'list',
										};
								  })
								: data
						}
						{...args}
					/>
				</Provider>
			</QueryClientProvider>
		</NextQueryParamProvider>
	);
};

describe('Component: <MediaCardList />', () => {
	it('Should be able to show children that are always visible', () => {
		renderMediaCardList({});
		const child = '<child>';
		expect(screen.getByText(child)).toBeDefined();
	});

	it('Should apply the vertical orientation when rendered in grid view', () => {
		const { container } = renderMediaCardList({});

		const element = container.getElementsByClassName('c-card--orientation-vertical');

		expect(element.length).toBeGreaterThan(0);
	});

	it('Should apply the horizontal--at-md orientation when rendered in list view', () => {
		const { container } = renderMediaCardList({}, true);
		const element = container.getElementsByClassName('c-card--orientation-horizontal--at-md');

		expect(element.length).toBeGreaterThan(0);
	});
});
