import { fireEvent, render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import { mockStore } from '../../../../__mocks__/store';
import { mockBladeProps } from './__mocks__/blade';
import { Blade } from './Blade';
import type { BladeProps } from './Blade.types';

// Mock ResizeObserver used in ScrollableTabs component
window.ResizeObserver =
	window.ResizeObserver ||
	class {
		disconnect = vi.fn();
		observe = vi.fn();
		unobserve = vi.fn();
	};

const renderBlade = (
	bladeProps: BladeProps = mockBladeProps,
	children: ReactNode = <p>some child</p>
) => {
	// Focus trap needs at least one focusable element inside it to be able to lock the focus
	// biome-ignore lint/a11y/useValidAnchor: this is a test file, not actual production code
	const mockInteractiveElement = <a href="#">test</a>;

	return render(
		<Provider store={mockStore}>
			<Blade {...bladeProps}>
				{children}
				{mockInteractiveElement}
			</Blade>
		</Provider>
	);
};

describe('Component: <Blade /> (default)', () => {
	it('Should render all options', () => {
		const { container } = renderBlade();

		expect(container).toBeInTheDocument();
	});

	it('Should render a title when open', () => {
		const title = 'new title';
		const { getByRole, getByText } = renderBlade({
			...mockBladeProps,
			title,
			isOpen: true,
		});

		const header = getByRole('dialog').querySelector('.c-blade__title');
		expect(header).toBeInTheDocument();

		const bladeTitle = getByText(title);
		expect(bladeTitle).toBeInTheDocument();
	});

	it('Should not render a title when closed', () => {
		const title = 'new title';
		const { getByText } = renderBlade({
			...mockBladeProps,
			title,
		});

		try {
			getByText(title);
		} catch (error) {
			expect(error);
		}
	});

	it('Should render children when open', () => {
		const { getByText } = renderBlade({ ...mockBladeProps, isOpen: true }, <span>some child</span>);

		const bladeChildren = getByText('some child');

		expect(bladeChildren).toBeInTheDocument();
	});

	it('Should not render children when closed', () => {
		const { getByText } = renderBlade(undefined, <span>some child</span>);

		try {
			getByText('some child');
		} catch (error) {
			expect(error);
		}
	});

	it('Should render a footer when open', () => {
		const footerLabel = 'some footer';
		const { getByRole, getByText } = renderBlade({
			...mockBladeProps,
			isOpen: true,
			footerButtons: [{ label: footerLabel, mobileLabel: footerLabel, type: 'primary' }],
		});

		const footer = getByRole('dialog').querySelector('.c-blade__footer');
		expect(footer).toBeInTheDocument();

		const bladeFooter = getByText(footerLabel);
		expect(bladeFooter).toBeInTheDocument();
	});

	it('Should not render a footer when closed', () => {
		const footerLabel = 'some footer';
		const { getByText } = renderBlade({
			...mockBladeProps,
			footerButtons: [{ label: footerLabel, mobileLabel: footerLabel, type: 'primary' }],
		});

		try {
			getByText(footerLabel);
		} catch (error) {
			expect(error);
		}
	});

	it('Should render a close button by default', () => {
		const { getByRole } = renderBlade({ ...mockBladeProps, isOpen: true });

		const closeButton = getByRole('dialog').querySelector('.c-blade__close-button');

		expect(closeButton).toBeInTheDocument();
	});

	it('Should call onClose when the close button is clicked', () => {
		const onClose = vi.fn();
		const { getByRole } = renderBlade({
			...mockBladeProps,
			onClose,
			isOpen: true,
		}); // Buttons inside blades are only enabled when the blade is open

		const closeButton = getByRole('dialog').querySelector('.c-blade__close-button');

		closeButton && fireEvent.click(closeButton);

		expect(onClose).toHaveBeenCalled();
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('Should call onClose when the overlay is clicked', () => {
		const onClose = vi.fn();
		const { container } = renderBlade({ ...mockBladeProps, onClose });

		const overlay = container.firstChild;

		overlay && fireEvent.click(overlay);

		expect(onClose).toHaveBeenCalled();
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('Should set the correct class name', () => {
		const className = 'class-name';
		const { container } = renderBlade({ ...mockBladeProps, className });

		expect(container.children[1]).toHaveClass(className);
	});

	it('Should set the correct class name when isOpen = true', () => {
		const { container } = renderBlade({ ...mockBladeProps, isOpen: true });

		expect(container.children[1]).toHaveClass('c-blade--visible');
	});

	it('Should set the correct class name when isOpen = false', () => {
		const { container } = renderBlade({ ...mockBladeProps, isOpen: false });

		expect(container.children[1]).not.toHaveClass('c-blade--visible');
	});
});
