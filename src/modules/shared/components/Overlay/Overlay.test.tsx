import { render, screen } from '@testing-library/react';

import Overlay from './Overlay';
import styles from './Overlay.module.scss';

describe('Component: <Overlay /> (default)', () => {
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
});
