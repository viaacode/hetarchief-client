import { render, screen, waitFor } from '@testing-library/react';

import Navigation from './Navigation';
import { MOCK_HAMBURGER_PROPS, MOCK_ITEMS_LEFT, MOCK_ITEMS_RIGHT } from './__mocks__/navigation';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
	useSelector: jest.fn(),
	useDispatch: () => mockDispatch,
}));

describe('Components', () => {
	describe('<Navigation />', () => {
		it('Should render children in the left section', () => {
			const leftTestId = 'leftTestId';

			render(
				<Navigation showBorder>
					<Navigation.Left placement="left">
						<div data-testid={leftTestId} />
					</Navigation.Left>
				</Navigation>
			);

			const leftChild = screen.queryByTestId(leftTestId);
			expect(leftChild).toBeInTheDocument();
		});

		it('Should render items in the left section', async () => {
			render(
				<Navigation showBorder>
					<Navigation.Left placement="left" items={MOCK_ITEMS_LEFT} />
				</Navigation>
			);

			const leftItem = screen.queryAllByText('Over de leeszalen')[0];
			await waitFor(() => {
				expect(leftItem).toBeInTheDocument();
			});
		});

		it('Should render children in the center section', () => {
			const centerTestId = 'centerTestId';

			render(
				<Navigation showBorder>
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
				<Navigation showBorder>
					<Navigation.Center title={title} />
				</Navigation>
			);

			const centerTitle = screen.queryByText(title);
			expect(centerTitle).toBeInTheDocument();
		});

		it('Should render children in the right section', () => {
			const rightTestId = 'rightTestId';

			render(
				<Navigation showBorder>
					<Navigation.Right placement="right">
						<div data-testid={rightTestId} />
					</Navigation.Right>
				</Navigation>
			);

			const rightChild = screen.queryByTestId(rightTestId);
			expect(rightChild).toBeInTheDocument();
		});

		it('Should render items in the right section', async () => {
			render(
				<Navigation showBorder>
					<Navigation.Right placement="right" items={MOCK_ITEMS_RIGHT} />
				</Navigation>
			);

			const rightItem = screen.queryByText('Log uit');
			await waitFor(() => {
				expect(rightItem).toBeInTheDocument();
			});
		});

		it('Should render dropdown when renderHamburger = true', async () => {
			render(
				<Navigation showBorder>
					<Navigation.Left
						placement="right"
						items={MOCK_ITEMS_LEFT}
						renderHamburger={true}
						hamburgerProps={MOCK_HAMBURGER_PROPS}
					/>
				</Navigation>
			);

			const trigger = screen.queryByText('Menu');
			await waitFor(() => {
				expect(trigger).toBeInTheDocument();
			});
		});
		it('Should not render dropdown when renderHamburger = false', async () => {
			render(
				<Navigation showBorder>
					<Navigation.Left
						placement="right"
						items={MOCK_ITEMS_LEFT}
						hamburgerProps={MOCK_HAMBURGER_PROPS}
					/>
				</Navigation>
			);

			const trigger = screen.queryByText('Menu');
			await waitFor(() => {
				expect(trigger).not.toBeInTheDocument();
			});
		});

		it('Should render overlay when a dropdown is rendered', async () => {
			const { container } = render(
				<Navigation showBorder>
					<Navigation.Left
						placement="right"
						items={MOCK_ITEMS_LEFT}
						renderHamburger={true}
						hamburgerProps={MOCK_HAMBURGER_PROPS}
					/>
				</Navigation>
			);

			const overlay = container.querySelector(
				'.c-navigation__section--responsive-mobile .c-navigation__dropdown-overlay'
			);

			await waitFor(() => {
				expect(overlay).toBeInTheDocument();
			});
		});

		it('Should not render overlay when no dropdown is rendered', async () => {
			const { container } = render(
				<Navigation showBorder>
					<Navigation.Left placement="right" items={MOCK_ITEMS_LEFT} />
				</Navigation>
			);

			const overlay = container.querySelector(
				'.c-navigation__section--responsive-mobile .c-navigation__dropdown-overlay'
			);

			await waitFor(() => {
				expect(overlay).not.toBeInTheDocument();
			});
		});

		it('Should render an icon when a menu item has children', async () => {
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
				<Navigation showBorder>
					<Navigation.Left placement="right" items={items} />
				</Navigation>
			);

			const link = screen.getByText('link');
			await waitFor(() => {
				expect(link.nextSibling).toHaveClass('c-icon');
			});
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
				<Navigation showBorder>
					<Navigation.Left placement="right" items={items} />
				</Navigation>
			);

			const link = screen.getByText('link');

			expect(link.nextSibling).not.toBeInTheDocument();
		});

		it('Should render dropdown children', async () => {
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
				<Navigation showBorder>
					<Navigation.Left placement="right" items={items} />
				</Navigation>
			);

			const item = screen.getByText('item 1');
			await waitFor(() => {
				expect(item).toBeInTheDocument();
			});
		});
	});
});
