import { fireEvent, render } from '@testing-library/react';

import Toggle from './Toggle';
import { ToggleOptions, ToggleProps } from './Toggle.types';
import { toggleMock } from './__mocks__';

const renderToggle = (mock: ToggleProps = toggleMock) => {
	return render(<Toggle {...mock} />);
};

describe('Component: <Toggle /> (default)', () => {
	it('Should render all options', () => {
		const { container } = renderToggle();

		expect(container.firstChild?.childNodes).toHaveLength(toggleMock.options.length);
	});

	it('Should render all options', () => {
		const { getAllByRole } = renderToggle();

		const buttons = getAllByRole('button');

		expect(buttons).toHaveLength(toggleMock.options.length);
	});

	it('Should set the correct class name', () => {
		const className = 'class-name';
		const { container } = renderToggle({ ...toggleMock, className: className });

		expect(container.firstChild).toHaveClass(className);
	});

	it('Should set disabled class on non-active elements', () => {
		const options: ToggleOptions[] = [
			{
				id: 'grid',
				iconName: 'grid-view',
				active: false,
			},
		];
		const { getByRole } = renderToggle({ options: options, onChange: () => null });

		const button = getByRole('button');

		expect(button).toHaveClass('c-toggle__option--disabled');
	});

	it('Should not set disabled class on active elements', () => {
		const options: ToggleOptions[] = [
			{
				id: 'grid',
				iconName: 'grid-view',
				active: true,
			},
		];
		const { getByRole } = renderToggle({ ...toggleMock, options: options });

		const button = getByRole('button');

		expect(button).not.toHaveClass('c-toggle__option--disabled');
	});

	it('Should call onChange when an option is clicked', () => {
		const onChangeHandler = jest.fn();
		const { getAllByRole } = renderToggle({ ...toggleMock, onChange: onChangeHandler });

		const button = getAllByRole('button')[1];

		fireEvent.click(button);

		expect(onChangeHandler).toHaveBeenCalled();
		expect(onChangeHandler).toHaveBeenCalledTimes(1);
		expect(onChangeHandler).toHaveBeenCalledWith(toggleMock.options[1].id);
	});
});
