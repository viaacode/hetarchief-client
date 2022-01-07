import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { mockTabs } from '../__mocks__/tabs';

import ScrollableTabs from './ScrollableTabs';

// Mock ResizeObserver used in ScrollableTabs component
window.ResizeObserver =
	window.ResizeObserver ||
	jest.fn().mockImplementation(() => ({
		disconnect: jest.fn(),
		observe: jest.fn(),
		unobserve: jest.fn(),
	}));

// Make sure the container is small enough to create overflow
const containerWidth = 320;
const baseContainer = document.createElement('div');
baseContainer.style.cssText = `max-width: ${containerWidth}px; width: 100%;`;

describe('<ScrollableTabs />', () => {
	const tabsComponent = <ScrollableTabs tabs={mockTabs} />;

	it('Should show correct gradients after scroll', () => {
		const { container } = render(tabsComponent, { container: baseContainer });
		const scrollable = container.querySelector('.c-scrollable-tabs');
		const tabs = container.querySelector('.c-tabs') as HTMLElement;

		// Scroll to far right
		fireEvent.scroll(tabs, { target: { scrollLeft: containerWidth } });
		expect(scrollable).toHaveClass('c-scrollable-tabs c-scrollable-tabs--gradient-left');

		// Scroll to far left
		fireEvent.scroll(tabs, { target: { scrollLeft: -containerWidth } });
		expect(scrollable).toHaveClass('c-scrollable-tabs c-scrollable-tabs--gradient-right');
	});
});
