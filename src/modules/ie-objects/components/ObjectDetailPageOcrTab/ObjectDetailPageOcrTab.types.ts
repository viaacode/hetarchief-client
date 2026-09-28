import type { OcrSearchResult } from '@ie-objects/ie-objects.types';
import type { TextLine } from '@iiif-viewer/IiifViewer.types';

export interface ObjectDetailPageOcrTabProps {
	ieObjectId: string;
	altoText: TextLine[] | undefined;
	altoTextsOnCurrentPageForSearchTerms: { text: TextLine; tabbable: boolean }[];
	searchResults: OcrSearchResult[];
	currentSearchResultIndex: number;
	currentPageIndex: number;
	pageCount: number;
	setCurrentPageIndex: (pageIndex: number, updateType: 'replaceIn') => void;
	searchTermsTemp: string;
	setSearchTermsTemp: (searchTerms: string) => void;
	searchTerms: string;
	searchTermWords: string[];
	arePagesOcrTextsAvailable: boolean;
	onSearch: (newSearchTerms: string) => Promise<void>;
	onClearSearch: () => void;
	onChangeSearchIndex: (searchResultIndex: number) => Promise<void>;
	onClickOnOcrWord: (textLocation: TextLine) => void;
	isTextOverlayVisible: boolean;
	onIsTextOverlayVisibleChange: (isVisible: boolean) => void;
}
