export interface SitemapPriorityEntry {
	priority: number;
	path: string;
}

export interface SitemapPrioritiesParseResult {
	status: 'success' | 'error';
	error: string | null;
	sitemapPriorities: SitemapPriorityEntry[];
}
