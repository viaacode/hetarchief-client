import { fireEvent, render, screen } from '@testing-library/react';

import Overlay from './Overlay';
import styles from './Overlay.module.scss';

fdescribe('Component: <Overlay /> (default)', () => {
	it('Should render hidden overlay', () => {
		const testId = 'overlayWrapper';

		render(
			<div data-testid={testId}>
				<Overlay />
			</div>
		);

		const overlay = screen.getByTestId(testId).getElementsByClassName(styles['c-overlay']);
		expect(overlay[0].classList.contains('c-overlay--visible')).toBe(false);
	});

	it('Should render default visible overlay', () => {
		const testId = 'overlayWrapper';

		render(
			<div data-testid={testId}>
				<Overlay visible />
			</div>
		);

		const overlay = screen.getByTestId(testId).getElementsByClassName(styles['c-overlay']);
		expect(overlay[0].classList.contains('c-overlay--dark')).toBe(true);
		expect(overlay[0].classList.contains('c-overlay--visible')).toBe(true);
	});

	it('Should render dark overlay', () => {
		const testId = 'overlayWrapper';

		render(
			<div data-testid={testId}>
				<Overlay type="dark" visible={true} />
			</div>
		);

		const overlay = screen.getByTestId(testId).getElementsByClassName(styles['c-overlay']);
		expect(overlay[0].classList.contains('c-overlay--dark')).toBe(true);
	});

	it('Should render light overlay', () => {
		const testId = 'overlayWrapper';

		render(
			<div data-testid={testId}>
				<Overlay type="light" visible={true} />
			</div>
		);

		const overlay = screen.getByTestId(testId).getElementsByClassName(styles['c-overlay']);
		expect(overlay[0].classList.contains('c-overlay--light')).toBe(true);
	});

	it('Should call the onClick handler when clicked', () => {
		const testId = 'overlayWrapper';
		const onClickHandler = jest.fn();

		render(
			<div data-testid={testId}>
				<Overlay type="light" visible={true} onClick={onClickHandler} />
			</div>
		);

		const overlay = screen.getByTestId(testId).getElementsByClassName(styles['c-overlay'])[0];

		fireEvent.click(overlay);

		expect(onClickHandler).toHaveBeenCalled();
		expect(onClickHandler).toHaveBeenCalledTimes(1);
	});

	it('Should set the correct animation class', () => {
		const testId = 'overlayWrapper';
		const animate = 'animate-default';

		render(
			<div data-testid={testId}>
				<Overlay type="light" visible={true} animate={animate} />
			</div>
		);

		const overlay = screen.getByTestId(testId).getElementsByClassName(styles['c-overlay'])[0];

		expect(overlay).toHaveClass(`c-overlay--${animate}`);
	});
});
