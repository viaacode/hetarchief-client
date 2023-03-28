import {
	SitemapPrioritiesParseResult,
	SitemapPriorityEntry,
} from './parse-sitemap-priorities.types';

const sitemapPriorityLineRegexp = /^\s*([0-9](\.[0-9])?)\s*(\/.*)\s*$/;

export function parseSitemapPriorities(
	sitemapPrioritiesString: string
): SitemapPrioritiesParseResult {
	const lines = sitemapPrioritiesString
		.split(/[\n\r]+/)
		.map((line) => line.trim())
		.filter((line) => !!line);
	const sitemapPriorities: SitemapPriorityEntry[] = [];
	const errors: string[] = [];
	lines.forEach((line, lineIndex) => {
		if (sitemapPriorityLineRegexp.test(line)) {
			const priority = line.split(/\s/g)[0].trim();
			const path = line.substring(priority.length).trim();
			sitemapPriorities.push({
				priority: parseFloat(priority),
				path,
			});
		} else {
			errors.push('Error op regel ' + (lineIndex + 1));
		}
	});

	return {
		status: errors.length ? 'error' : 'success',
		error: errors.length ? errors.join('\n') : null,
		sitemapPriorities,
	};
}

export function stringifySitemapPriorities(sitemapPriorities: SitemapPriorityEntry[]): string {
	return sitemapPriorities.map((entry) => entry.priority + ' ' + entry.path).join('\n');
}
