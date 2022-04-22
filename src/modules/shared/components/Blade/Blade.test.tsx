import { fireEvent, render } from '@testing-library/react';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { mockStore } from './../../../../__mocks__/store';
import Blade from './Blade';
import { BladeProps } from './Blade.types';
import { bladeMock } from './__mocks__/blade';

const renderBlade = (mock: BladeProps = bladeMock, children: ReactNode = <p>some child</p>) => {
	return render(
		<Provider store={mockStore}>
			<Blade {...mock}>{children}</Blade>
		</Provider>
	);
};

describe('Component: <Blade /> (default)', () => {
	it('Should render all options', () => {
		const { container } = renderBlade();

		expect(container).toBeInTheDocument();
	});

	it('Should render a title', () => {
		const title = 'new title';
		const { getByText } = renderBlade({ ...bladeMock, title });

		const bladeTitle = getByText(title);

		expect(bladeTitle).toBeInTheDocument();
	});

	it('Should render a heading', () => {
		const headingText = 'some heading';
		const heading = <h2>{headingText}</h2>;
		const { getByText } = renderBlade({ ...bladeMock, heading });

		const bladeHeading = getByText(headingText);

		expect(bladeHeading).toBeInTheDocument();
	});

	it('Should render a heading when title and heading are provided', () => {
		const title = 'new title';
		const headingText = 'some heading';
		const heading = <h2>{headingText}</h2>;
		const { queryByText } = renderBlade({ ...bladeMock, heading, title });

		const bladeHeading = queryByText(headingText);
		const bladeTitle = queryByText(title);

		expect(bladeHeading).toBeInTheDocument();
		expect(bladeTitle).not.toBeInTheDocument();
	});

	it('Should render children', () => {
		const { getByText } = renderBlade();

		const bladeChildren = getByText('some child');

		expect(bladeChildren).toBeInTheDocument();
	});

	it('Should render a footer', () => {
		const footerLabel = 'some footer';
		const footer = <div>{footerLabel}</div>;
		const { getByText } = renderBlade({ ...bladeMock, footer });

		const bladeFooter = getByText(footerLabel);

		expect(bladeFooter).toBeInTheDocument();
	});

	it('Should render a close button by default', () => {
		const { getByRole } = renderBlade();

		const closeButton = getByRole('dialog').querySelector('.c-blade__close-button');

		expect(closeButton).toBeInTheDocument();
	});

	it('Should not render a close button when hideCloseButton = true', () => {
		const hideCloseButton = true;
		const { getByRole } = renderBlade({ ...bladeMock, hideCloseButton });

		const closeButton = getByRole('dialog').querySelector('.c-blade__close-button');

		expect(closeButton).not.toBeInTheDocument();
	});

	it('Should call onClose when the close button is clicked', () => {
		const onClose = jest.fn();
		const { getByRole } = renderBlade({ ...bladeMock, onClose });

		const closeButton = getByRole('dialog').querySelector('.c-blade__close-button');

		closeButton && fireEvent.click(closeButton);

		expect(onClose).toHaveBeenCalled();
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('Should not render overlay when hideOverlay = true', () => {
		const hideOverlay = true;
		const { container } = renderBlade({ ...bladeMock, hideOverlay });

		const blade = container.firstChild;

		expect(blade).toHaveClass('c-blade');
	});

	it('Should call onClose when the overlay is clicked', () => {
		const onClose = jest.fn();
		const { container } = renderBlade({ ...bladeMock, onClose });

		const overlay = container.firstChild;

		overlay && fireEvent.click(overlay);

		expect(onClose).toHaveBeenCalled();
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('Should set the correct class name', () => {
		const className = 'class-name';
		const { container } = renderBlade({ ...bladeMock, className });

		expect(container.children[1]).toHaveClass(className);
	});

	it('Should set the correct class name when isOpen = true', () => {
		const isOpen = true;
		const { container } = renderBlade({ ...bladeMock, isOpen });

		expect(container.children[1]).toHaveClass('c-blade--visible');
	});

	it('Should set the correct class name when isOpen = false', () => {
		const isOpen = false;
		const { container } = renderBlade({ ...bladeMock, isOpen });

		expect(container.children[1]).not.toHaveClass('c-blade--visible');
	});
});
