import type { OcrSearchResult } from '@ie-objects/ie-objects.types';
import type { TextLine } from '@iiif-viewer/IiifViewer.types';
import type { RefObject } from 'react';

export interface ObjectDetailPageOcrTabProps {
	ieObjectId: string;
	altoText: TextLine[] | undefined;
	altoTextsOnCurrentPageForSearchTerms: { text: TextLine; tabbable: boolean }[];
	searchResults: OcrSearchResult[];
	currentSearchResultIndex: number;
	currentPageIndex: number;
	pageCount: number;
	setCurrentPageIndex: (pageIndex: number, updateType: 'replaceIn') => void;
	searchTermWords: string[];
	onClickOnOcrWord: (textLocation: TextLine) => void;
	isTextOverlayVisible: boolean;
	onIsTextOverlayVisibleChange: (isVisible: boolean) => void;
	arePagesOcrTextsAvailable: boolean;
	searchTermsTemp: string;
	setSearchTermsTemp: (searchTerms: string) => void;
	searchTerms: string;
	onSearch: (newSearchTerms: string) => Promise<void>;
	onClearSearch: () => void;
	onChangeSearchIndex: (searchResultIndex: number) => Promise<void>;
	// The page's own scroll container (ObjectDetailPage.tsx's sidebarContentRef) - used as the
	// IntersectionObserver root that detects when the search item itself becomes stuck (see
	// ObjectDetailPageOcrTab.tsx's own comment), which happens later than - and independently of -
	// the page's header collapsing, so that signal can't be reused here.
	scrollContainerRef: RefObject<HTMLDivElement | null>;
	// Set while this tab is auto-scrolling to a search result, so ObjectDetailPageSidebar's
	// collapse-sentinel observer can tell that apart from the user scrolling back up.
	isProgrammaticScrollRef: RefObject<boolean>;
}
