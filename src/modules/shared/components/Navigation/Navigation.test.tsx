import { fireEvent, render, screen } from '@testing-library/react';

import Navigation from './Navigation';
import { MOCK_ITEMS_LEFT, MOCK_ITEMS_RIGHT } from './__mocks__/navigation';

describe('Components', () => {
	describe('<Navigation />', () => {
		it('Should render children in the left section', () => {
			const leftTestId = 'leftTestId';

			render(
				<Navigation>
					<Navigation.Left placement="left">
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
					<Navigation.Left placement="left" items={MOCK_ITEMS_LEFT} />
				</Navigation>
			);

			const leftItem = screen.queryAllByText('Over de leeszalen')[0];
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
					<Navigation.Right placement="right">
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
					<Navigation.Right placement="right" items={MOCK_ITEMS_RIGHT} />
				</Navigation>
			);

			const rightItem = screen.queryByText('Log uit');
			expect(rightItem).toBeInTheDocument();
		});

		it('Should render dropdown when renderHamburger = true', () => {
			render(
				<Navigation>
					<Navigation.Left
						placement="right"
						items={MOCK_ITEMS_LEFT}
						renderHamburger={true}
						hamburgerProps={{
							hamburgerLabelOpen: 'sluit',
							hamburgerLabelClosed: 'Menu',
							hamburgerIconOpen: 'times',
							hamburgerIconClosed: 'grid-view',
						}}
					/>
				</Navigation>
			);

			const trigger = screen.queryByText('Menu');
			expect(trigger).toBeInTheDocument();
		});
		it('Should not render dropdown when renderHamburger = false', () => {
			render(
				<Navigation>
					<Navigation.Left
						placement="right"
						items={MOCK_ITEMS_LEFT}
						hamburgerProps={{
							hamburgerLabelOpen: 'sluit',
							hamburgerLabelClosed: 'Menu',
							hamburgerIconOpen: 'times',
							hamburgerIconClosed: 'grid-view',
						}}
					/>
				</Navigation>
			);

			const trigger = screen.queryByText('Menu');
			expect(trigger).not.toBeInTheDocument();
		});

		it('Should render overlay when a dropdown is rendered', () => {
			const { container } = render(
				<Navigation>
					<Navigation.Left
						placement="right"
						items={MOCK_ITEMS_LEFT}
						renderHamburger={true}
						hamburgerProps={{
							hamburgerLabelOpen: 'sluit',
							hamburgerLabelClosed: 'Menu',
							hamburgerIconOpen: 'times',
							hamburgerIconClosed: 'grid-view',
						}}
					/>
				</Navigation>
			);

			const overlay = container.querySelector(
				'.c-navigation__section--responsive-mobile .c-navigation__dropdown-overlay'
			);

			expect(overlay).toBeInTheDocument();
		});

		it('Should not render overlay when no dropdown is rendered', () => {
			const { container } = render(
				<Navigation>
					<Navigation.Left placement="right" items={MOCK_ITEMS_LEFT} />
				</Navigation>
			);

			const overlay = container.querySelector(
				'.c-navigation__section--responsive-mobile .c-navigation__dropdown-overlay'
			);

			expect(overlay).not.toBeInTheDocument();
		});

		it('Should render an icon when a menu item has children', () => {
			const items = [
				{
					node: <div>link</div>,
					id: 'link',
					hasDivider: true,
					children: [
						{
							node: <div>item 1</div>,
							id: 'item 1',
						},
					],
				},
			];

			render(
				<Navigation>
					<Navigation.Left placement="right" items={items} />
				</Navigation>
			);

			const link = screen.getByText('link');

			expect(link.nextSibling).toHaveClass('c-icon');
		});

		it('Should not render an icon when a menu item has no children', () => {
			const items = [
				{
					node: <div>link</div>,
					id: 'link',
					hasDivider: true,
				},
			];

			render(
				<Navigation>
					<Navigation.Left placement="right" items={items} />
				</Navigation>
			);

			const link = screen.getByText('link');

			expect(link.nextSibling).not.toBeInTheDocument();
		});

		it('Should render dropdown children', () => {
			const items = [
				{
					node: <div>link</div>,
					id: 'link',
					hasDivider: true,
					children: [
						{
							node: <div>item 1</div>,
							id: 'item 1',
						},
					],
				},
			];

			render(
				<Navigation>
					<Navigation.Left placement="right" items={items} />
				</Navigation>
			);

			const item = screen.getByText('item 1');

			expect(item).toBeInTheDocument();
		});
	});
});
