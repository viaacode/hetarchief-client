import { fireEvent, render } from '@testing-library/react';

import FragmentSlider from './FragmentSlider';
import { fragmentSliderMock } from './__mocks__/fragmentSlider';

const renderFragmentSlider = ({ ...rest }) => {
	return render(<FragmentSlider {...fragmentSliderMock} {...rest} />);
};

describe('Component: <FragmentSlider /> (default)', () => {
	it('Should set the correct class name', () => {
		const className = 'custom class';
		const { container } = renderFragmentSlider({ className });

		expect(container.firstChild).toHaveClass(className);
	});

	it('Should display fragments', () => {
		const { getAllByRole } = renderFragmentSlider({});

		const fragments = getAllByRole('listitem');

		expect(fragments.length).toBe(fragmentSliderMock.fragments.length);
	});

	it('Should display two buttons', () => {
		const { getAllByRole } = renderFragmentSlider({});

		const buttons = getAllByRole('button');

		expect(buttons.length).toBe(2);
	});

	it('Should set the first item as active by default', () => {
		const { getAllByRole } = renderFragmentSlider({});

		const fragments = getAllByRole('listitem');

		expect(fragments[0]).toHaveClass('c-fragment-slider__item--active');
	});

	it('Should update active fragment on fragment click', () => {
		const { getAllByRole } = renderFragmentSlider({});

		const fragments = getAllByRole('listitem');

		fireEvent.click(fragments[1]);

		expect(fragments[0]).not.toHaveClass('c-fragment-slider__item--active');
		expect(fragments[1]).toHaveClass('c-fragment-slider__item--active');
	});

	it('Should call onChangeFragment on fragment click', () => {
		const onChangeFragment = jest.fn();
		const { getAllByRole } = renderFragmentSlider({ onChangeFragment });

		const fragments = getAllByRole('listitem');

		fireEvent.click(fragments[1]);

		expect(onChangeFragment).toHaveBeenCalled();
		expect(onChangeFragment).toHaveBeenCalledTimes(1);
		expect(onChangeFragment).toHaveBeenCalledWith(1);
	});
});
