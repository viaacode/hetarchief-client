import type { OcrSearchResult } from '@ie-objects/ie-objects.types';

export interface SearchInputWithResultsPaginationProps {
	value: string;
	onChange: (newValue: string) => void;
	onSearch: (searchTerm: string) => void;
	onClearSearch: () => void;
	onChangeSearchIndex: (newSearchIndex: number) => void;
	searchResults: OcrSearchResult[] | null;
	currentSearchIndex: number;
	className?: string;
	variants?: string[];
}
