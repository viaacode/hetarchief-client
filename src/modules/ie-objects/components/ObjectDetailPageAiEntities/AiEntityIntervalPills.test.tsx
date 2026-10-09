import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import type { AiEntityInterval } from '@ie-objects/utils/map-ai-entities';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string, params?: Record<string, unknown>) =>
		[key.split('___')[1] ?? key, ...Object.values(params ?? {})].join(' '),
}));

import { AiEntityIntervalPills } from './AiEntityIntervalPills';

const PILLS_PER_ROW = 2;
const ROWS_PER_PAGE = 2;
const PILLS_PER_PAGE = PILLS_PER_ROW * ROWS_PER_PAGE;

// 12 point intervals => 3 pages of 4 pills; the label of pill n is its start in seconds
const INTERVALS: AiEntityInterval[] = Array.from({ length: 12 }, (_, index) => ({
	start: (index + 1) * 10,
	end: (index + 1) * 10,
}));

// The page owns the active interval; the buttons stand in for a click on the timeline
const StatefulPills = ({ isInteractive = true }: { isInteractive?: boolean }) => {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	return (
		<>
			{INTERVALS.map((interval, index) => (
				<button
					key={interval.start}
					type="button"
					data-testid={`timeline-${index}`}
					onClick={() => setActiveIndex(index)}
				/>
			))}
			<AiEntityIntervalPills
				intervals={INTERVALS}
				activeIndex={activeIndex}
				isInteractive={isInteractive}
				onSelect={setActiveIndex}
			/>
		</>
	);
};

const selectOnTimeline = (index: number) =>
	fireEvent.click(screen.getByTestId(`timeline-${index}`));
const getPageIndicator = () => screen.getByText(/^page-van-pageCount/);
const getActivePill = () => screen.queryByRole('button', { pressed: true });

describe('Component: <AiEntityIntervalPills />', () => {
	let originalOffsetTop: PropertyDescriptor | undefined;

	beforeEach(() => {
		vi.stubGlobal(
			'ResizeObserver',
			class {
				observe() {}
				unobserve() {}
				disconnect() {}
			}
		);
		// jsdom has no layout: place PILLS_PER_ROW pills on each row
		originalOffsetTop = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetTop');
		Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
			configurable: true,
			get(this: HTMLElement) {
				const siblings = Array.from(this.parentElement?.children ?? []);
				return Math.floor(siblings.indexOf(this) / PILLS_PER_ROW) * 32;
			},
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		if (originalOffsetTop) {
			Object.defineProperty(HTMLElement.prototype, 'offsetTop', originalOffsetTop);
		}
	});

	it('splits the pills into pages of two rows', () => {
		render(<StatefulPills />);

		expect(getPageIndicator()).toHaveTextContent('page-van-pageCount 1 3');
		expect(screen.getAllByRole('button', { name: /^\d/ })).toHaveLength(PILLS_PER_PAGE);
	});

	it('jumps to the page of an interval that is selected on the timeline', () => {
		render(<StatefulPills />);

		selectOnTimeline(9);

		expect(getPageIndicator()).toHaveTextContent('page-van-pageCount 3 3');
		expect(getActivePill()).toBeInTheDocument();
	});

	it('jumps back to the active pill when the user paged away and selects another interval on the same page', () => {
		render(<StatefulPills />);

		selectOnTimeline(5);
		expect(getPageIndicator()).toHaveTextContent('page-van-pageCount 2 3');

		fireEvent.click(screen.getByRole('button', { name: 'vorige' }));
		expect(getPageIndicator()).toHaveTextContent('page-van-pageCount 1 3');
		expect(getActivePill()).not.toBeInTheDocument();

		// Index 6 is on the same page as index 5, so the page of the active pill does not change
		selectOnTimeline(6);

		expect(getPageIndicator()).toHaveTextContent('page-van-pageCount 2 3');
		expect(getActivePill()).toBeInTheDocument();
	});

	it('keeps the current page when a pill on that page is clicked', () => {
		render(<StatefulPills />);

		fireEvent.click(screen.getByRole('button', { name: 'volgende' }));
		fireEvent.click(screen.getAllByRole('button', { name: /^\d/ })[1]);

		expect(getPageIndicator()).toHaveTextContent('page-van-pageCount 2 3');
		expect(getActivePill()).toBeInTheDocument();
	});

	it('does not move the page when nothing is active', () => {
		render(<StatefulPills />);

		fireEvent.click(screen.getByRole('button', { name: 'volgende' }));

		expect(getPageIndicator()).toHaveTextContent('page-van-pageCount 2 3');
	});
});
