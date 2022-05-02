import { fireEvent, render } from '@testing-library/react';

import DynamicActionMenu from './DynamicActionMenu';
import { dynamicActionMenuMock } from './__mocks__/dynamic-action-menu';

const renderObjectPlaceholder = ({ ...rest }) => {
	return render(<DynamicActionMenu {...dynamicActionMenuMock} {...rest} />);
};

describe('Components', () => {
	describe('<DynamicactionMenu />', () => {
		it('Should set the correct class name', () => {
			const className = 'custom class name';
			const { container } = renderObjectPlaceholder({ className });

			expect(container.firstChild).toHaveClass(className);
		});

		it('Should render all buttons', () => {
			const { getAllByRole } = renderObjectPlaceholder({});

			const buttons = getAllByRole('button');

			expect(buttons).toHaveLength(dynamicActionMenuMock.actions.length);
		});

		it('Should render the correct icon', () => {
			const { getAllByRole } = renderObjectPlaceholder({});

			const buttons = getAllByRole('button');

			buttons.forEach((button) => {
				expect(button.querySelector('.c-icon')).toBeInTheDocument();
			});
		});

		it('Should set the correct aria-label', () => {
			const { getAllByRole } = renderObjectPlaceholder({});

			const buttons = getAllByRole('button');

			buttons.forEach((button, index) => {
				expect(button).toHaveAttribute(
					'aria-label',
					dynamicActionMenuMock.actions[index].ariaLabel
				);
			});
		});

		it('Should call the onClickAction callback when a button is clicked', () => {
			const onClickAction = jest.fn();
			const { getAllByRole } = renderObjectPlaceholder({ onClickAction });

			const buttons = getAllByRole('button');

			fireEvent.click(buttons[0]);

			expect(onClickAction).toHaveBeenCalled();
			expect(onClickAction).toHaveBeenCalledTimes(1);
			expect(onClickAction).toHaveBeenCalledWith(dynamicActionMenuMock.actions[0].id);
		});
	});
});
