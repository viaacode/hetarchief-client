import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentProps, RefObject } from 'react';

import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string) => key,
}));
vi.mock(
	'@iiif-viewer/components/SearchInputWithResults/OcrSearchInputWithResultsPagination',
	() => ({
		OcrSearchInputWithResultsPagination: () => <div data-testid="ocr-search" />,
	})
);

import type { TextLine } from '@iiif-viewer/IiifViewer.types';
import { ObjectDetailPageOcrTab } from './ObjectDetailPageOcrTab';

const word = (text: string, x: number): TextLine => ({ text, x, y: 0, width: 1, height: 1 });
const ALTO_TEXT = [word('eerste', 0), word('tweede', 1), word('derde', 2)];

const createScrollContainer = (): RefObject<HTMLDivElement | null> => {
	const element = document.createElement('div');
	element.scrollTo = vi.fn() as unknown as typeof element.scrollTo;
	Object.defineProperty(element, 'clientHeight', { value: 400 });
	element.getBoundingClientRect = () => ({ top: 100 }) as DOMRect;
	return { current: element };
};

let observe: ReturnType<typeof vi.fn>;
let disconnect: ReturnType<typeof vi.fn>;

const renderTab = (overrides: Partial<ComponentProps<typeof ObjectDetailPageOcrTab>> = {}) => {
	const props: ComponentProps<typeof ObjectDetailPageOcrTab> = {
		ieObjectId: 'ie-1',
		altoText: ALTO_TEXT,
		altoTextsOnCurrentPageForSearchTerms: [],
		searchResults: [],
		currentSearchResultIndex: -1,
		currentPageIndex: 0,
		pageCount: 3,
		setCurrentPageIndex: vi.fn(),
		searchTermWords: [],
		onClickOnOcrWord: vi.fn(),
		isTextOverlayVisible: false,
		onIsTextOverlayVisibleChange: vi.fn(),
		arePagesOcrTextsAvailable: true,
		searchTermsTemp: '',
		setSearchTermsTemp: vi.fn(),
		searchTerms: '',
		onSearch: vi.fn(),
		onClearSearch: vi.fn(),
		onChangeSearchIndex: vi.fn(),
		scrollContainerRef: createScrollContainer(),
		...overrides,
	};
	return { props, ...render(<ObjectDetailPageOcrTab {...props} />) };
};

const searchHitOnSecondWord: Partial<ComponentProps<typeof ObjectDetailPageOcrTab>> = {
	altoTextsOnCurrentPageForSearchTerms: [{ text: ALTO_TEXT[1], tabbable: true }],
	searchResults: [
		{ pageIndex: 0, searchTerm: 'tweede', searchTermCharacterOffset: 7, searchTermIndexOnPage: 0 },
	],
	currentSearchResultIndex: 0,
	searchTermWords: ['tweede'],
};

describe('Component: <ObjectDetailPageOcrTab />', () => {
	beforeEach(() => {
		observe = vi.fn();
		disconnect = vi.fn();
		vi.stubGlobal(
			'IntersectionObserver',
			class {
				observe = observe;
				disconnect = disconnect;
			}
		);
	});

	describe('active search result', () => {
		it('scrolls the container so the active word sits in the middle', () => {
			const scrollContainerRef = createScrollContainer();
			// Word sits 500px below the container's top edge, with the container already scrolled 50px
			(scrollContainerRef.current as HTMLDivElement).scrollTop = 50;
			const wordRect = { top: 600 } as DOMRect;
			vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
				this: HTMLElement
			) {
				return this === scrollContainerRef.current ? ({ top: 100 } as DOMRect) : wordRect;
			});

			renderTab({ ...searchHitOnSecondWord, scrollContainerRef });

			// 600 - 100 + 50 - 400 / 2
			expect(scrollContainerRef.current?.scrollTo).toHaveBeenCalledWith({ top: 350 });
			vi.restoreAllMocks();
		});

		it('never scrolls to a negative position', () => {
			const scrollContainerRef = createScrollContainer();
			vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
				this: HTMLElement
			) {
				return this === scrollContainerRef.current
					? ({ top: 100 } as DOMRect)
					: ({ top: 110 } as DOMRect);
			});

			renderTab({ ...searchHitOnSecondWord, scrollContainerRef });

			expect(scrollContainerRef.current?.scrollTo).toHaveBeenCalledWith({ top: 0 });
			vi.restoreAllMocks();
		});

		it('does not scroll without an active search result', () => {
			const scrollContainerRef = createScrollContainer();

			renderTab({ scrollContainerRef });

			expect(scrollContainerRef.current?.scrollTo).not.toHaveBeenCalled();
		});
	});

	describe('words', () => {
		it('marks the words of the found search terms', () => {
			renderTab(searchHitOnSecondWord);

			expect(screen.getByText('tweede')).toHaveClass('p-object-detail-ocr-tab__word--marked');
			expect(screen.getByText('tweede')).toHaveClass(
				'p-object-detail-ocr-tab__word--marked--active'
			);
			expect(screen.getByText('eerste')).not.toHaveClass('p-object-detail-ocr-tab__word--marked');
		});

		it('reports the clicked word', () => {
			const { props } = renderTab();

			fireEvent.click(screen.getByText('derde'));

			expect(props.onClickOnOcrWord).toHaveBeenCalledWith(ALTO_TEXT[2]);
		});

		it('toggles the text overlay on double click', () => {
			const { props } = renderTab({ isTextOverlayVisible: false });

			fireEvent.doubleClick(screen.getByText('eerste'));

			expect(props.onIsTextOverlayVisibleChange).toHaveBeenCalledWith(true);
		});
	});

	describe('search bar', () => {
		it('renders when OCR texts are available and observes its sticky sentinel', () => {
			renderTab({ arePagesOcrTextsAvailable: true });

			expect(screen.getByTestId('ocr-search')).toBeInTheDocument();
			expect(observe).toHaveBeenCalledTimes(1);
		});

		it('is left out, without an observer, when no OCR texts are available', () => {
			renderTab({ arePagesOcrTextsAvailable: false });

			expect(screen.queryByTestId('ocr-search')).not.toBeInTheDocument();
			expect(observe).not.toHaveBeenCalled();
		});

		it('stops observing on unmount', () => {
			const { unmount } = renderTab();

			unmount();

			expect(disconnect).toHaveBeenCalled();
		});
	});

	describe('pagination', () => {
		it('disables previous on the first page and goes to the next page', () => {
			const { props } = renderTab({ currentPageIndex: 0, pageCount: 3 });

			expect(
				screen.getByRole('button', {
					name: 'modules/iiif-viewer/iiif-viewer___ga-naar-de-vorige-afbeelding',
				})
			).toBeDisabled();

			fireEvent.click(
				screen.getByRole('button', {
					name: 'modules/iiif-viewer/iiif-viewer___ga-naar-de-volgende-afbeelding',
				})
			);

			expect(props.setCurrentPageIndex).toHaveBeenCalledWith(1, 'replaceIn');
		});

		it('disables next on the last page and goes to the previous page', () => {
			const { props } = renderTab({ currentPageIndex: 2, pageCount: 3 });

			expect(
				screen.getByRole('button', {
					name: 'modules/iiif-viewer/iiif-viewer___ga-naar-de-volgende-afbeelding',
				})
			).toBeDisabled();

			fireEvent.click(
				screen.getByRole('button', {
					name: 'modules/iiif-viewer/iiif-viewer___ga-naar-de-vorige-afbeelding',
				})
			);

			expect(props.setCurrentPageIndex).toHaveBeenCalledWith(1, 'replaceIn');
		});
	});
});
