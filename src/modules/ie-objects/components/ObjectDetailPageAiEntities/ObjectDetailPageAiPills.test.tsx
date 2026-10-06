import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { FileMentionEntityType } from '@ie-objects/ie-objects.types';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
import { SearchFilterId } from '@visitor-space/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string, params?: Record<string, unknown>) =>
		[key.split('___')[1] ?? key, ...Object.values(params ?? {})].join(' '),
	tHtml: (key: string) => key.split('___')[1] ?? key,
}));
vi.mock('@shared/hooks/use-locale/use-locale', () => ({ useLocale: () => 'nl' }));
vi.mock('next/link', () => ({
	default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
		<a href={href} {...rest}>
			{children}
		</a>
	),
}));
vi.mock(
	'@ie-objects/components/ObjectDetailPageMetadataTab/ObjectDetailPageMetadataDisclaimerTooltip',
	() => ({
		ObjectDetailPageMetadataDisclaimerTooltip: ({
			ariaLabel,
			content,
		}: {
			ariaLabel: string;
			content: React.ReactNode;
		}) => <button type="button" aria-label={ariaLabel} data-content={String(content)} />,
	})
);

import { ObjectDetailPageAiPills } from './ObjectDetailPageAiPills';

const ROW_WIDTH_PX = 200;
const PILL_WIDTH_PX = 80;
const TOGGLE_WIDTH_PX = 60;

const place = (id: string, name: string, overrides: Partial<AiEntity> = {}): AiEntity => ({
	id,
	type: FileMentionEntityType.PLACE,
	name,
	wikidataId: 'Q12892',
	wikidataUrl: 'https://www.wikidata.org/wiki/Q12892',
	still: null,
	intervals: [
		{ start: 36, end: 66 },
		{ start: 118, end: 118 },
	],
	...overrides,
});

const renderPlaces = (
	props: Partial<React.ComponentProps<typeof ObjectDetailPageAiPills>> = {}
) => {
	const onSeek = vi.fn();
	const result = render(
		<ObjectDetailPageAiPills
			entities={[place('a', 'Antwerpen'), place('b', 'Brugge')]}
			title="2 plaatsen"
			searchFilterId={SearchFilterId.MentionPlace}
			durationSeconds={200}
			isTimelineInteractive={true}
			onSeek={onSeek}
			disclaimer="disclaimer"
			disclaimerAriaLabel="meer info"
			{...props}
		/>
	);
	return { onSeek, ...result };
};

const sevenPlaces = Array.from({ length: 7 }, (_, index) => place(`p${index}`, `Plaats${index}`));
const getPillButtons = () => screen.getAllByRole('button', { name: /^Plaats\d$/ });

describe('Component: <ObjectDetailPageAiPills />', () => {
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
		// jsdom has no layout: the hidden measuring copy gets fixed widths, everything else is wide
		originalRect = Element.prototype.getBoundingClientRect;
		Element.prototype.getBoundingClientRect = function (this: Element) {
			let width = 1000;
			if (this.hasAttribute('data-pill')) {
				width = PILL_WIDTH_PX;
			} else if (this.hasAttribute('data-toggle')) {
				width = TOGGLE_WIDTH_PX;
			} else if (this.getAttribute('class')?.includes('__measure')) {
				width = ROW_WIDTH_PX;
			}
			return { width, height: 16, top: 0, left: 0, right: 0, bottom: 0 } as DOMRect;
		};
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		Element.prototype.getBoundingClientRect = originalRect;
	});

	it('shows the title it is given', () => {
		renderPlaces({ title: '2 plaatsen' });

		expect(screen.getByText('2 plaatsen')).toBeInTheDocument();
	});

	it('renders nothing without entities', () => {
		const { container } = renderPlaces({ entities: [] });

		expect(container).toBeEmptyDOMElement();
	});

	it('passes the disclaimer that the caller set', () => {
		renderPlaces({ disclaimer: 'custom disclaimer', disclaimerAriaLabel: 'custom label' });

		expect(screen.getByLabelText('custom label')).toHaveAttribute(
			'data-content',
			'custom disclaimer'
		);
	});

	describe('overflowing pills', () => {
		it('shows the pills that fit in two rows next to a Toon meer link', () => {
			renderPlaces({ entities: sevenPlaces });

			// [80 80] [80 + 60]
			expect(getPillButtons()).toHaveLength(3);
			expect(screen.getByRole('button', { name: 'toon-meer' })).toHaveAttribute(
				'aria-expanded',
				'false'
			);
		});

		it('shows every pill with Toon meer, and collapses again with Toon minder', () => {
			renderPlaces({ entities: sevenPlaces });

			fireEvent.click(screen.getByRole('button', { name: 'toon-meer' }));
			expect(getPillButtons()).toHaveLength(7);
			expect(screen.queryByRole('button', { name: 'toon-meer' })).not.toBeInTheDocument();

			fireEvent.click(screen.getByRole('button', { name: 'toon-minder' }));
			expect(getPillButtons()).toHaveLength(3);
		});

		it('has no toggle when everything fits in two rows', () => {
			renderPlaces({ entities: sevenPlaces.slice(0, 4) });

			expect(getPillButtons()).toHaveLength(4);
			expect(screen.queryByRole('button', { name: 'toon-meer' })).not.toBeInTheDocument();
		});

		it('expands by itself when the initially selected place is hidden', () => {
			renderPlaces({ entities: sevenPlaces, initialSelectedId: 'p5' });

			expect(getPillButtons()).toHaveLength(7);
			expect(screen.getByRole('button', { name: 'Plaats5' })).toHaveAttribute(
				'aria-expanded',
				'true'
			);
		});
	});

	it('opens the card of the clicked place, swaps it for another and closes it on a second click', () => {
		renderPlaces();
		expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: 'Antwerpen' }));
		expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Antwerpen');
		expect(screen.getByRole('button', { name: 'Antwerpen' })).toHaveAttribute(
			'aria-expanded',
			'true'
		);

		fireEvent.click(screen.getByRole('button', { name: 'Brugge' }));
		expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1);
		expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Brugge');

		fireEvent.click(screen.getByRole('button', { name: 'Brugge' }));
		expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
	});

	it('opens the initially selected place straight away', () => {
		renderPlaces({ initialSelectedId: 'b' });

		expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Brugge');
	});

	describe('visitekaartje', () => {
		beforeEach(() => {
			renderPlaces({ initialSelectedId: 'a' });
		});

		it('has no picture or initials next to the name', () => {
			expect(screen.queryByRole('img')).not.toBeInTheDocument();
			expect(screen.getByRole('heading', { level: 3 }).parentElement?.previousSibling).toBeNull();
		});

		it('links the Wikidata id to the Wikidata page in a new tab', () => {
			const link = screen.getByRole('link', { name: 'Q12892' });

			expect(link).toHaveAttribute('href', 'https://www.wikidata.org/wiki/Q12892');
			expect(link).toHaveAttribute('target', '_blank');
		});

		it('links to the search page filtered on the place', () => {
			const link = screen.getByRole('link', {
				name: 'zoek-alle-objecten-met-deze-entiteit',
			});

			expect(link.getAttribute('href')).toContain('mentionPlace=Antwerpen');
		});
	});

	it('seeks to TC-in when an interval pill is clicked', () => {
		const { onSeek } = renderPlaces({ initialSelectedId: 'a' });

		fireEvent.click(screen.getAllByRole('button', { name: '01:58' })[0]);

		expect(onSeek).toHaveBeenCalledWith(118);
	});
});
