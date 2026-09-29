import type { OcrSearchResult } from '@ie-objects/ie-objects.types';

export interface ObjectDetailPageOcrTabStickyBarProps {
	arePagesOcrTextsAvailable: boolean;
	searchTermsTemp: string;
	setSearchTermsTemp: (searchTerms: string) => void;
	searchTerms: string;
	searchResults: OcrSearchResult[];
	currentSearchResultIndex: number;
	onSearch: (newSearchTerms: string) => Promise<void>;
	onClearSearch: () => void;
	onChangeSearchIndex: (searchResultIndex: number) => Promise<void>;
	// Same signal that drives the page's own sticky header shadow (ObjectDetailPage.tsx's
	// isHeaderCollapsed) - restores the padding below the search input once the sticky bar is
	// actually stuck/shadowed, instead of leaving it redundant while still in natural flow.
	isScrolled: boolean;
}
