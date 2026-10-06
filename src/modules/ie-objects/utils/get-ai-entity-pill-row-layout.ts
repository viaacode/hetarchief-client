interface PillRowLayoutOptions {
	pillWidthsPx: number[];
	/** Width of the "Toon meer" link that closes the last row */
	toggleWidthPx: number;
	containerWidthPx: number;
	gapPx: number;
	maxRows: number;
}

// Greedy wrapping, like flex-wrap: an item that doesn't fit next to the previous one starts a new row
const getRowCount = (itemWidthsPx: number[], containerWidthPx: number, gapPx: number): number => {
	let rows = 1;
	let usedPx = 0;
	for (const itemWidthPx of itemWidthsPx) {
		const widthPx = Math.min(itemWidthPx, containerWidthPx);
		if (usedPx > 0 && usedPx + gapPx + widthPx > containerWidthPx) {
			rows += 1;
			usedPx = widthPx;
		} else {
			usedPx = usedPx > 0 ? usedPx + gapPx + widthPx : widthPx;
		}
	}
	return rows;
};

/**
 * How many pills are shown while collapsed: all of them when they fit in `maxRows`, otherwise as
 * many as fit together with the toggle. Never fewer than one, so the field is never empty.
 */
export const getAiEntityPillRowVisibleCount = ({
	pillWidthsPx,
	toggleWidthPx,
	containerWidthPx,
	gapPx,
	maxRows,
}: PillRowLayoutOptions): number => {
	if (containerWidthPx <= 0 || getRowCount(pillWidthsPx, containerWidthPx, gapPx) <= maxRows) {
		return pillWidthsPx.length;
	}

	let visibleCount = 1;
	for (let count = pillWidthsPx.length - 1; count >= 1; count--) {
		const widths = [...pillWidthsPx.slice(0, count), toggleWidthPx];
		if (getRowCount(widths, containerWidthPx, gapPx) <= maxRows) {
			visibleCount = count;
			break;
		}
	}
	return visibleCount;
};
