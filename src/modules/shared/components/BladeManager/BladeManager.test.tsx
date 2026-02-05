import { Button } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';

import { describe, expect, it, vi } from 'vitest';
import { mockStore } from '../../../../__mocks__/store';
import BladeManager from './BladeManager';

// Mock ResizeObserver used in ScrollableTabs component
window.ResizeObserver =
	window.ResizeObserver ||
	class {
		disconnect = vi.fn();
		observe = vi.fn();
		unobserve = vi.fn();
	};

const renderBladeManager = (currentBlade = 0, onClose = () => null) => {
	return render(
		<Provider store={mockStore}>
			<BladeManager currentLayer={currentBlade} onCloseBlade={onClose}>
				<Blade
					isOpen={true}
					title={'Blade 1'}
					layer={1}
					id="blade1"
					footerButtons={[{ label: 'continue', type: 'primary' }]}
				>
					<Button label="Open second blade" />
				</Blade>
				<Blade
					isOpen={false}
					title={'Blade 2'}
					layer={2}
					id="blade2"
					footerButtons={[{ label: 'continue', type: 'primary' }]}
				>
					<Button label="Open third blade" />
				</Blade>
				<Blade
					isOpen={false}
					title={'Blade 3'}
					layer={3}
					id="blade3"
					footerButtons={[{ label: 'continue', type: 'primary' }]}
				/>
			</BladeManager>
		</Provider>
	);
};

describe('Component: <Blade /> (default)', () => {
	it('Should render all options', () => {
		const { container } = renderBladeManager();

		expect(container).toBeInTheDocument();
	});

	it('Should not render blades when current layer is 0', () => {
		renderBladeManager();

		try {
			screen.getByText('Blade 1').parentElement;
		} catch (error) {
			expect(error);
		}
		try {
			screen.getByText('Blade 2').parentElement;
		} catch (error) {
			expect(error);
		}
		try {
			screen.getByText('Blade 3').parentElement;
		} catch (error) {
			expect(error);
		}
	});

	it('render all layers under currentLayer', () => {
		renderBladeManager(2);

		const blade1 = screen.getByText('Blade 1').parentElement?.parentElement;
		const blade2 = screen.getByText('Blade 2').parentElement?.parentElement;
		try {
			screen.getByText('Blade 3').parentElement;
		} catch (error) {
			expect(error);
		}

		expect(blade1).toHaveClass('c-blade--visible');
		expect(blade2).toHaveClass('c-blade--visible');
	});

	it('render overlay under a blade', () => {
		renderBladeManager(1);

		const blade1 = screen.getByText('Blade 1').parentElement?.parentElement;

		expect(blade1?.previousSibling).toHaveClass('c-overlay');
	});

	it('render call onClose when the close button is clicked', () => {
		const onClick = vi.fn() as () => null;
		renderBladeManager(2, onClick);

		const closeButton =
			screen.getByText('Blade 1').parentElement?.parentElement?.previousElementSibling;

		closeButton && fireEvent.click(closeButton);

		expect(onClick).toHaveBeenCalled;
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(1, 2);
	});

	it('render call onClose when the overlay is clicked', () => {
		const onClick = vi.fn() as () => null;
		renderBladeManager(1, onClick);

		const overlay =
			screen.getByText('Blade 1').parentElement?.parentElement?.previousElementSibling;

		overlay && fireEvent.click(overlay);

		expect(onClick).toHaveBeenCalled;
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(1, 1);
	});

	it('render render overlays progressively lighter', () => {
		const { container } = renderBladeManager(3);

		const overlays = container.querySelectorAll('.c-overlay');

		expect(overlays[1]).toHaveStyle('opacity: 0.4');
		expect(overlays[2]).toHaveStyle('opacity: 0.3');
	});
});
