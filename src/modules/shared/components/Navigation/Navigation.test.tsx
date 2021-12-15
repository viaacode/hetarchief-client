import { render, screen } from '@testing-library/react';

import Navigation from './Navigation';
import { MOCK_ITEMS_LEFT, MOCK_ITEMS_RIGHT } from './__mocks__';

describe('Components', () => {
	describe('<Navigation />', () => {
		it('Should render children in the left section', () => {
			const leftTestId = 'leftTestId';

			render(
				<Navigation>
					<Navigation.Left>
						<div data-testid={leftTestId} />
					</Navigation.Left>
				</Navigation>
			);

			const leftChild = screen.queryByTestId(leftTestId);
			expect(leftChild).toBeInTheDocument();
		});

		it('Should render items in the left section', () => {
			render(
				<Navigation>
					<Navigation.Left items={MOCK_ITEMS_LEFT} />
				</Navigation>
			);

			const leftItem = screen.queryByText(MOCK_ITEMS_LEFT[0][1].label);
			expect(leftItem).toBeInTheDocument();
		});

		it('Should render children in the center section', () => {
			const centerTestId = 'centerTestId';

			render(
				<Navigation>
					<Navigation.Center>
						<div data-testid={centerTestId} />
					</Navigation.Center>
				</Navigation>
			);

			const centerChild = screen.queryByTestId(centerTestId);
			expect(centerChild).toBeInTheDocument();
		});

		it('Should render a title in the center section', () => {
			const title = 'title';

			render(
				<Navigation>
					<Navigation.Center title={title} />
				</Navigation>
			);

			const centerTitle = screen.queryByText(title);
			expect(centerTitle).toBeInTheDocument();
		});

		it('Should render children in the right section', () => {
			const rightTestId = 'rightTestId';

			render(
				<Navigation>
					<Navigation.Right>
						<div data-testid={rightTestId} />
					</Navigation.Right>
				</Navigation>
			);

			const rightChild = screen.queryByTestId(rightTestId);
			expect(rightChild).toBeInTheDocument();
		});

		it('Should render items in the right section', () => {
			render(
				<Navigation>
					<Navigation.Right items={MOCK_ITEMS_RIGHT} />
				</Navigation>
			);

			const rightItem = screen.queryByText(MOCK_ITEMS_RIGHT[0][0].label);
			expect(rightItem).toBeInTheDocument();
		});
	});
});
