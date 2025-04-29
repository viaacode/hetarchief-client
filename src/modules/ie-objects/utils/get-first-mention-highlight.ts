import type { MentionHighlight } from '@ie-objects/ie-objects.types';
import { isNil, minBy } from 'lodash-es';

const SAME_LINE_Y_THRESHOLD = 5;

export function getFirstMentionHighlight(highlights: MentionHighlight[]): MentionHighlight | null {
	if (highlights.length === 0) {
		return null;
	}
	// Find highest y coordinate
	const minY = minBy(highlights, (highlight) => highlight.y)?.y;
	if (isNil(minY)) {
		return null;
	}

	// Find all highlights on the same line
	const sameLineHighlights = highlights.filter(
		(highlight) => highlight.y < minY + SAME_LINE_Y_THRESHOLD
	);

	// Return the most left highlight on the first line
	const furthestLeftHighlightOrFirstLine = minBy(sameLineHighlights, (highlight) => highlight.x);
	return furthestLeftHighlightOrFirstLine || null;
}
