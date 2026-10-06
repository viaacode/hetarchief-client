import { fireEvent, render, screen, within } from '@testing-library/react';

import '@testing-library/jest-dom';
import { FileMentionEntityType } from '@ie-objects/ie-objects.types';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
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
vi.mock('@meemoo/react-components', async (importOriginal) => ({
	...(await importOriginal<typeof import('@meemoo/react-components')>()),
	Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	TooltipContent: () => null,
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

import { ObjectDetailPageAiPersons } from './ObjectDetailPageAiPersons';

const PILLS_PER_ROW = 3;
const BAR_WIDTH_PX = 1000;

// 14 intervals of 5s every 10s: far enough apart for 14 separate bar segments in a 200s item
const manyIntervals = Array.from({ length: 14 }, (_, index) => ({
	start: index * 10,
	end: index * 10 + 5,
}));

const person = (id: string, name: string, overrides: Partial<AiEntity> = {}): AiEntity => ({
	id,
	type: FileMentionEntityType.PERSON,
	name,
	wikidataId: 'Q986532',
	wikidataUrl: 'https://www.wikidata.org/wiki/Q986532',
	still: null,
	intervals: [
		{ start: 36, end: 66 },
		{ start: 118, end: 118 },
	],
	...overrides,
});

const renderPersons = (
	props: Partial<React.ComponentProps<typeof ObjectDetailPageAiPersons>> = {}
) => {
	const onSeek = vi.fn();
	const result = render(
		<ObjectDetailPageAiPersons
			persons={[person('a', 'Jane Eve Doe'), person('b', 'Marjolein De Wilde')]}
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

const getCard = () => screen.getByRole('heading', { level: 3 }).closest('div[id]') as HTMLElement;

describe('Component: <ObjectDetailPageAiPersons />', () => {
	let elementWidthPx = BAR_WIDTH_PX;
	let originalOffsetTop: PropertyDescriptor | undefined;
	let originalRect: typeof Element.prototype.getBoundingClientRect;

	beforeEach(() => {
		elementWidthPx = BAR_WIDTH_PX;
		vi.stubGlobal(
			'ResizeObserver',
			class {
				observe() {}
				unobserve() {}
				disconnect() {}
			}
		);
		// jsdom has no layout: place PILLS_PER_ROW pills on each row and give every element a width
		originalOffsetTop = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetTop');
		Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
			configurable: true,
			get(this: HTMLElement) {
				const siblings = Array.from(this.parentElement?.children ?? []);
				return Math.floor(siblings.indexOf(this) / PILLS_PER_ROW) * 32;
			},
		});
		originalRect = Element.prototype.getBoundingClientRect;
		Element.prototype.getBoundingClientRect = () =>
			({ width: elementWidthPx, height: 16, top: 0, left: 0, right: 0, bottom: 0 }) as DOMRect;
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		if (originalOffsetTop) {
			Object.defineProperty(HTMLElement.prototype, 'offsetTop', originalOffsetTop);
		}
		Element.prototype.getBoundingClientRect = originalRect;
	});

	it('shows the number of persons with a singular or plural label', () => {
		const { unmount } = renderPersons();
		expect(screen.getByText('count-personen 2')).toBeInTheDocument();
		unmount();

		renderPersons({ persons: [person('a', 'Jane Eve Doe')] });
		expect(screen.getByText('1-persoon')).toBeInTheDocument();
	});

	it('renders nothing without persons', () => {
		const { container } = renderPersons({ persons: [] });

		expect(container).toBeEmptyDOMElement();
	});

	it('passes the disclaimer that the caller set', () => {
		renderPersons({ disclaimer: 'custom disclaimer', disclaimerAriaLabel: 'custom label' });

		expect(screen.getByLabelText('custom label')).toHaveAttribute(
			'data-content',
			'custom disclaimer'
		);
	});

	describe('overflowing avatars', () => {
		const sevenPersons = Array.from({ length: 7 }, (_, index) =>
			person(`p${index}`, `Persoon Nummer${index}`)
		);
		// 3 avatars and the toggle fit: 4 * 40px + 3 * 8px = 184px
		const NARROW_ROW_PX = 200;
		const getAvatarButtons = () => screen.getAllByRole('button', { name: /^Persoon Nummer\d$/ });

		it('shows the avatars that fit, with a +N circle for the rest', () => {
			elementWidthPx = NARROW_ROW_PX;
			renderPersons({ persons: sevenPersons });

			expect(getAvatarButtons()).toHaveLength(3);
			expect(screen.getByRole('button', { name: 'toon-meer' })).toHaveTextContent('plus-count 4');
		});

		it('shows every avatar with +N, and collapses again with the Toon minder link', () => {
			elementWidthPx = NARROW_ROW_PX;
			renderPersons({ persons: sevenPersons });

			fireEvent.click(screen.getByRole('button', { name: 'toon-meer' }));
			expect(getAvatarButtons()).toHaveLength(7);
			expect(screen.queryByRole('button', { name: 'toon-meer' })).not.toBeInTheDocument();

			fireEvent.click(screen.getByRole('button', { name: 'toon-minder' }));
			expect(getAvatarButtons()).toHaveLength(3);
		});

		it('has no toggle when everything fits in one row', () => {
			renderPersons({ persons: sevenPersons });

			expect(getAvatarButtons()).toHaveLength(7);
			expect(screen.queryByRole('button', { name: 'toon-meer' })).not.toBeInTheDocument();
		});

		it('expands by itself when the initially selected person is hidden', () => {
			elementWidthPx = NARROW_ROW_PX;
			renderPersons({ persons: sevenPersons, initialSelectedId: 'p5' });

			expect(getAvatarButtons()).toHaveLength(7);
			expect(screen.getByRole('button', { name: 'Persoon Nummer5' })).toHaveAttribute(
				'aria-expanded',
				'true'
			);
		});
	});

	it('shows initials when a person has no still', () => {
		renderPersons();

		expect(screen.getByRole('button', { name: 'Jane Eve Doe' })).toHaveTextContent('JD');
	});

	it('opens the card of the clicked person, swaps it for another and closes it on a second click', () => {
		renderPersons();
		expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: 'Jane Eve Doe' }));
		expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Jane Eve Doe');
		expect(screen.getByRole('button', { name: 'Jane Eve Doe' })).toHaveAttribute(
			'aria-expanded',
			'true'
		);

		fireEvent.click(screen.getByRole('button', { name: 'Marjolein De Wilde' }));
		expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1);
		expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Marjolein De Wilde');

		fireEvent.click(screen.getByRole('button', { name: 'Marjolein De Wilde' }));
		expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
	});

	it('opens the initially selected person straight away', () => {
		renderPersons({ initialSelectedId: 'b' });

		expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Marjolein De Wilde');
	});

	describe('visitekaartje', () => {
		beforeEach(() => {
			renderPersons();
			fireEvent.click(screen.getByRole('button', { name: 'Jane Eve Doe' }));
		});

		it('links the Wikidata id to the Wikidata page in a new tab', () => {
			const link = screen.getByRole('link', { name: 'Q986532' });

			expect(link).toHaveAttribute('href', 'https://www.wikidata.org/wiki/Q986532');
			expect(link).toHaveAttribute('target', '_blank');
		});

		it('links to the search page filtered on the person', () => {
			const link = screen.getByRole('link', {
				name: 'zoek-alle-objecten-met-deze-entiteit',
			});

			expect(link.getAttribute('href')).toContain('mentionPerson=Jane%20Eve%20Doe');
		});

		it('only shows TC-out for intervals that have a different TC-out', () => {
			const card = within(getCard());

			expect(card.getAllByText('00:36').length).toBeGreaterThan(0);
			expect(card.getAllByText('01:06').length).toBeGreaterThan(0);
			expect(card.getAllByText('01:58').length).toBeGreaterThan(0);
			expect(card.queryAllByText('02:00')).toHaveLength(0);
		});
	});

	describe('player sync', () => {
		it('seeks to TC-in and activates the pill when a pill is clicked', () => {
			const { onSeek } = renderPersons({ initialSelectedId: 'a' });
			const pill = screen.getAllByRole('button', { name: /^01:58$/ })[0];

			fireEvent.click(pill);

			expect(onSeek).toHaveBeenCalledWith(118);
			expect(pill).toHaveAttribute('aria-pressed', 'true');
		});

		it('activates the timeline segment together with its pill', () => {
			const { onSeek } = renderPersons({ initialSelectedId: 'a' });

			fireEvent.click(screen.getAllByRole('button', { name: /^00:36/ })[0]);

			const segments = screen.getAllByRole('button', { name: /spring-naar/ });
			expect(
				segments.filter((segment) => segment.getAttribute('aria-pressed') === 'true')
			).toHaveLength(1);
			expect(onSeek).toHaveBeenCalledTimes(1);
		});

		it('seeks to TC-in when a timeline segment is clicked', () => {
			const { onSeek } = renderPersons({ initialSelectedId: 'a' });

			fireEvent.click(screen.getByRole('button', { name: 'spring-naar-timestamp 01:58' }));

			expect(onSeek).toHaveBeenCalledWith(118);
		});

		it('is display only without access to the essence', () => {
			const { onSeek } = renderPersons({ initialSelectedId: 'a', isTimelineInteractive: false });

			expect(screen.queryByRole('button', { name: /spring-naar/ })).not.toBeInTheDocument();
			expect(screen.queryByRole('button', { name: '01:58' })).not.toBeInTheDocument();
			expect(screen.getAllByText('01:58').length).toBeGreaterThan(0);
			expect(onSeek).not.toHaveBeenCalled();
		});
	});

	describe('pagination', () => {
		const renderMany = () =>
			renderPersons({
				persons: [person('a', 'Jane Eve Doe', { intervals: manyIntervals })],
				initialSelectedId: 'a',
			});

		// 14 pills, 3 per row and 2 rows per page: pages of 6, 6 and 2
		const getPillButtons = () =>
			within(getCard())
				.getAllByRole('button')
				.filter((button) => /^\d\d:\d\d/.test(button.textContent ?? ''));

		it('shows two rows of pills per page, with a page indicator', () => {
			renderMany();

			expect(getPillButtons()).toHaveLength(6);
			expect(screen.getByText('page-van-pageCount 1 3')).toBeInTheDocument();
		});

		it('disables Vorige on the first page and Volgende on the last', () => {
			renderMany();
			const previous = screen.getByRole('button', { name: 'vorige' });
			const next = screen.getByRole('button', { name: 'volgende' });

			expect(previous).toBeDisabled();
			expect(next).toBeEnabled();

			fireEvent.click(next);
			fireEvent.click(next);

			expect(getPillButtons()).toHaveLength(2);
			expect(next).toBeDisabled();
			expect(previous).toBeEnabled();
		});

		it('jumps to the page of a pill when its timeline segment is clicked', () => {
			const { onSeek } = renderMany();

			// The pill of the 13th interval is on the third page
			fireEvent.click(screen.getByRole('button', { name: 'spring-naar-timestamp 02:00' }));

			expect(onSeek).toHaveBeenCalledWith(120);
			expect(
				getPillButtons().some((button) => /^02:00.*02:05$/.test(button.textContent ?? ''))
			).toBe(true);
			expect(screen.getByRole('button', { name: 'volgende' })).toBeDisabled();
		});

		it('has no pagination when everything fits', () => {
			renderPersons({ initialSelectedId: 'a' });

			expect(screen.queryByRole('button', { name: 'vorige' })).not.toBeInTheDocument();
		});
	});
});
