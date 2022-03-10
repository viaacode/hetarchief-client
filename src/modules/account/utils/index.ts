import { isSameDay } from 'date-fns';

import { Collection } from '@account/types';
import { formatWithLocale } from '@cp/components';

export function createCollectionSlug(
	collection: Pick<Collection, 'id' | 'name' | 'isDefault'>
): string {
	const uuidPart = collection.id.split('-', 1)[0];

	return encodeURIComponent(
		`${collection.name.toLowerCase().replaceAll(' ', '-')}` +
			(!collection.isDefault && uuidPart.length >= 1 ? `--${uuidPart}` : ``)
	);
}

export const formatHistoryDate = (date?: Date): string => {
	return formatWithLocale('PPp', date);
};

export const formatHistoryDates = (from?: Date | string, to?: Date | string): string => {
	const f = from ? new Date(from) : undefined;
	const t = to ? new Date(to) : undefined;

	if (f && !t) return formatHistoryDate(f);
	if (!f && t) return formatHistoryDate(t);

	const start = formatHistoryDate(f);
	const end = f && t && isSameDay(f, t) ? formatWithLocale('p', t) : formatHistoryDate(t);

	return `${start} - ${end}`;
};
