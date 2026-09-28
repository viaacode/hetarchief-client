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
}
