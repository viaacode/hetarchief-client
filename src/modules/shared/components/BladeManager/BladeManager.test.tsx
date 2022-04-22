import { Button } from '@meemoo/react-components';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { Blade } from '../Blade';

import { mockStore } from './../../../../__mocks__/store';
import BladeManager from './BladeManager';

const renderBladeManager = (currentBlade = 0, onClose = () => null) => {
	return render(
		<Provider store={mockStore}>
			<BladeManager currentLayer={currentBlade} onCloseBlade={onClose}>
				<Blade isOpen={false} title="Blade 1" layer={1}>
					<Button label="Open second blade" />
				</Blade>
				<Blade isOpen={false} title="Blade 2" layer={2}>
					<Button label="Open third blade" />
				</Blade>
				<Blade isOpen={false} title="Blade 3" layer={3} />
			</BladeManager>
		</Provider>
	);
};

describe('Component: <Blade /> (default)', () => {
	it('Should render all options', () => {
		const { container } = renderBladeManager();

		expect(container).toBeInTheDocument();
	});

	it('Should render multiple blades', () => {
		renderBladeManager();

		const blade1 = screen.getByText('Blade 1');
		const blade2 = screen.getByText('Blade 2');
		const blade3 = screen.getByText('Blade 3');

		expect(blade1).toBeInTheDocument();
		expect(blade2).toBeInTheDocument();
		expect(blade3).toBeInTheDocument();
	});

	it('render all layers under currentLayer', () => {
		renderBladeManager(2);

		const blade1 = screen.getByText('Blade 1').parentElement?.parentElement;
		const blade2 = screen.getByText('Blade 2').parentElement?.parentElement;
		const blade3 = screen.getByText('Blade 3').parentElement?.parentElement;

		expect(blade1).toHaveClass('c-blade--visible');
		expect(blade2).toHaveClass('c-blade--visible');
		expect(blade3).not.toHaveClass('c-blade--visible');
	});

	it('render overlay under a blade', () => {
		renderBladeManager(1);

		const blade1 = screen.getByText('Blade 1').parentElement?.parentElement;

		expect(blade1?.previousSibling).toHaveClass('c-overlay');
	});

	it('render call onClose when the close button is clicked', () => {
		const onClick = jest.fn();
		renderBladeManager(1, onClick);

		const closeButton = screen.getByText('Blade 1').parentElement?.previousElementSibling;

		closeButton && fireEvent.click(closeButton);

		expect(onClick).toHaveBeenCalled;
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(1);
	});

	it('render call onClose when the overlay is clicked', () => {
		const onClick = jest.fn();
		renderBladeManager(1, onClick);

		const overlay =
			screen.getByText('Blade 1').parentElement?.parentElement?.previousElementSibling;

		overlay && fireEvent.click(overlay);

		expect(onClick).toHaveBeenCalled;
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(1);
	});

	it('render render overlays progressively lighter', () => {
		const { container } = renderBladeManager(3);

		const overlays = container.querySelectorAll('.c-overlay');

		expect(overlays[1]).toHaveStyle('opacity: 0.4');
		expect(overlays[2]).toHaveStyle('opacity: 0.3');
	});
});
