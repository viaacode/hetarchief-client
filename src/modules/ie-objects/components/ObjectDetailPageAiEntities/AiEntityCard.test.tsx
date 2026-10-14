import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { FileMentionEntityType } from '@ie-objects/ie-objects.types';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string, params?: Record<string, unknown>) =>
		[key.split('___')[1] ?? key, ...Object.values(params ?? {})].join(' '),
}));
vi.mock('next/link', () => ({
	default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
		<a href={href} {...rest}>
			{children}
		</a>
	),
}));

import { AiEntityCard, type AiEntityCardProps } from './AiEntityCard';

const entity = (overrides: Partial<AiEntity> = {}): AiEntity => ({
	id: 'jane',
	type: FileMentionEntityType.PERSON,
	name: 'Jane Doe',
	wikidataId: 'Q986532',
	wikidataUrl: 'https://www.wikidata.org/wiki/Q986532',
	still: null,
	intervals: [
		{ start: 10, end: 20 },
		{ start: 60, end: 60 },
	],
	...overrides,
});

const renderCard = (props: Partial<AiEntityCardProps> = {}) => {
	const onSelectInterval = vi.fn();
	const result = render(
		<AiEntityCard
			entity={entity()}
			durationSeconds={120}
			isInteractive={true}
			searchLink="/zoeken?persoon=Jane%20Doe"
			activeIntervalIndex={null}
			onSelectInterval={onSelectInterval}
			{...props}
		/>
	);
	return { onSelectInterval, ...result };
};

const getTimelineSegments = () => document.querySelectorAll('.c-ai-entity-timeline__segment');

describe('Component: <AiEntityCard />', () => {
	let originalRect: typeof Element.prototype.getBoundingClientRect;

	beforeEach(() => {
		// jsdom has no layout: without a width the timeline draws nothing
		originalRect = Element.prototype.getBoundingClientRect;
		Element.prototype.getBoundingClientRect = () =>
			({ width: 1000, height: 8, top: 0, left: 0, right: 0, bottom: 0 }) as DOMRect;
		vi.stubGlobal(
			'ResizeObserver',
			class {
				observe() {}
				unobserve() {}
				disconnect() {}
			}
		);
	});

	afterEach(() => {
		Element.prototype.getBoundingClientRect = originalRect;
		vi.unstubAllGlobals();
	});

	it('shows the name and links to the search for the entity', () => {
		renderCard();

		expect(screen.getByRole('heading', { level: 3, name: 'Jane Doe' })).toBeInTheDocument();
		expect(
			screen.getByRole('link', { name: 'zoek-alle-objecten-met-deze-entiteit' })
		).toHaveAttribute('href', '/zoeken?persoon=Jane%20Doe');
	});

	describe('wikidata', () => {
		it('links the id to wikidata in a new tab', () => {
			renderCard();

			const link = screen.getByRole('link', { name: 'Q986532' });
			expect(link).toHaveAttribute('href', 'https://www.wikidata.org/wiki/Q986532');
			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		});

		it('shows the id as text when there is no url', () => {
			renderCard({ entity: entity({ wikidataUrl: null }) });

			expect(screen.getByText(/Q986532/)).toBeInTheDocument();
			expect(screen.queryByRole('link', { name: 'Q986532' })).not.toBeInTheDocument();
		});

		it('shows no wikidata line without an id', () => {
			renderCard({ entity: entity({ wikidataId: null, wikidataUrl: null }) });

			expect(screen.queryByText(/wikidata/i)).not.toBeInTheDocument();
		});
	});

	it('shows a portrait for a person only', () => {
		const { rerender } = renderCard();
		expect(screen.getByText('JD')).toBeInTheDocument();

		rerender(
			<AiEntityCard
				entity={entity({ id: 'gent', type: FileMentionEntityType.PLACE, name: 'Gent' })}
				durationSeconds={120}
				isInteractive={true}
				searchLink="/zoeken"
				activeIntervalIndex={null}
				onSelectInterval={vi.fn()}
			/>
		);

		// The place's name moves to the left instead of a first-letter circle
		expect(screen.queryByText('G')).not.toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 3, name: 'Gent' })).toBeInTheDocument();
	});

	describe('timeline and pills', () => {
		it('shows the intervals on the timeline and as pills', () => {
			renderCard();

			expect(getTimelineSegments()).toHaveLength(2);
			expect(screen.getByRole('button', { name: /^00:10/ })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /^01:00/ })).toBeInTheDocument();
		});

		it('hands the clicked pill to the caller', () => {
			const { onSelectInterval } = renderCard();

			fireEvent.click(screen.getByRole('button', { name: /^01:00/ }));

			expect(onSelectInterval).toHaveBeenCalledWith(1);
		});

		it('shows neither without any timed occurrence', () => {
			const { container } = renderCard({ entity: entity({ intervals: [] }) });

			expect(getTimelineSegments()).toHaveLength(0);
			expect(container.querySelector('.c-ai-entity-interval-pills')).not.toBeInTheDocument();
			expect(container.firstChild).toHaveClass('c-ai-entity-card--without-intervals');
		});

		it('leaves the timeline out when the length of the item is unknown, the pills stay', () => {
			renderCard({ durationSeconds: null });

			expect(getTimelineSegments()).toHaveLength(0);
			expect(screen.getByRole('button', { name: /^00:10/ })).toBeInTheDocument();
		});
	});

	describe('without access to the essence', () => {
		it('only displays the intervals', () => {
			renderCard({ isInteractive: false });

			expect(screen.queryByRole('button')).not.toBeInTheDocument();
			expect(getTimelineSegments()).toHaveLength(2);
		});

		it('highlights nothing, not even an interval that the url asked for', () => {
			renderCard({ isInteractive: false, activeIntervalIndex: 0 });

			expect(document.querySelector('[class*="--active"]')).not.toBeInTheDocument();
		});
	});

	it('highlights the active interval when interactive', () => {
		renderCard({ activeIntervalIndex: 1 });

		expect(screen.getByRole('button', { name: /^01:00/ })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: /^00:10/ })).toHaveAttribute('aria-pressed', 'false');
	});
});
