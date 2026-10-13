import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string, params?: Record<string, unknown>) =>
		[key.split('___')[1] ?? key, ...Object.values(params ?? {})].join(' '),
}));

import { AiEntityTimeline, type AiEntityTimelineProps } from './AiEntityTimeline';

const BAR_WIDTH_PX = 1000;

const renderTimeline = (props: Partial<AiEntityTimelineProps> = {}) => {
	const onSelect = vi.fn();
	const result = render(
		<AiEntityTimeline
			// 100 s over 1000 px: 10 px per second
			durationSeconds={100}
			intervals={[
				{ start: 10, end: 20 },
				{ start: 50, end: 50 },
			]}
			activeIndex={null}
			isInteractive={true}
			onSelect={onSelect}
			{...props}
		/>
	);
	return { onSelect, ...result };
};

describe('Component: <AiEntityTimeline />', () => {
	let originalRect: typeof Element.prototype.getBoundingClientRect;

	beforeEach(() => {
		vi.stubGlobal(
			'ResizeObserver',
			class {
				observe() {}
				unobserve() {}
				disconnect() {}
			}
		);
		// jsdom has no layout
		originalRect = Element.prototype.getBoundingClientRect;
		Element.prototype.getBoundingClientRect = () =>
			({ width: BAR_WIDTH_PX, height: 8, top: 0, left: 0, right: 0, bottom: 0 }) as DOMRect;
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		Element.prototype.getBoundingClientRect = originalRect;
	});

	it('draws a segment per interval, positioned and sized by time', () => {
		renderTimeline();

		const [first, second] = screen.getAllByRole('button');
		expect(first).toHaveStyle({ left: '10%', width: '10%' });
		// A point recognition gets the minimum width: 10 px of 1000
		expect(second).toHaveStyle({ left: '50%', width: '1%' });
	});

	it('names every segment after the timestamp it jumps to', () => {
		renderTimeline();

		expect(screen.getByRole('button', { name: 'spring-naar-timestamp 00:10' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'spring-naar-timestamp 00:50' })).toBeInTheDocument();
	});

	it('selects the interval of the clicked segment', () => {
		const { onSelect } = renderTimeline();

		fireEvent.click(screen.getByRole('button', { name: 'spring-naar-timestamp 00:50' }));

		expect(onSelect).toHaveBeenCalledWith(1);
	});

	it('marks the segment of the active interval as pressed', () => {
		renderTimeline({ activeIndex: 1 });

		const [first, second] = screen.getAllByRole('button');
		expect(first).toHaveAttribute('aria-pressed', 'false');
		expect(second).toHaveAttribute('aria-pressed', 'true');
	});

	it('draws segments that nearly touch as one, which selects the first of its intervals', () => {
		const { onSelect } = renderTimeline({
			// 10 s to 20 s and 20.1 s to 30 s: 1 px apart, closer than the merge gap
			intervals: [
				{ start: 10, end: 20 },
				{ start: 20.1, end: 30 },
			],
		});

		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(1);
		expect(buttons[0]).toHaveStyle({ left: '10%', width: '20%' });

		fireEvent.click(buttons[0]);
		expect(onSelect).toHaveBeenCalledWith(0);
	});

	it('highlights a merged segment when any interval in it is active', () => {
		renderTimeline({
			intervals: [
				{ start: 10, end: 20 },
				{ start: 20.1, end: 30 },
			],
			activeIndex: 1,
		});

		expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
	});

	it('is only a display without access: no buttons and nothing to click', () => {
		const { container, onSelect } = renderTimeline({ isInteractive: false, activeIndex: 0 });

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
		const segments = container.querySelectorAll('.c-ai-entity-timeline__segment');
		expect(segments).toHaveLength(2);
		for (const segment of segments) {
			expect(segment).not.toHaveClass('c-ai-entity-timeline__segment--interactive');
			fireEvent.click(segment);
		}
		expect(onSelect).not.toHaveBeenCalled();
	});

	it('draws nothing while the bar has no width yet', () => {
		Element.prototype.getBoundingClientRect = () => ({ width: 0 }) as DOMRect;

		renderTimeline();

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});
});
