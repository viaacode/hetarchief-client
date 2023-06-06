import { isAfter, parseISO } from 'date-fns';
import { isString } from 'lodash-es';

export function isCurrentTosAccepted(
	acceptedAt: Date | string | null | undefined,
	updatedAt: Date | string | null | undefined
): boolean {
	if (!acceptedAt) {
		return false;
	}
	if (!updatedAt) {
		throw new Error('No TOS_LAST_UPDATED_AT was set in the database.');
	}
	const acceptedAtDate = isString(acceptedAt) ? parseISO(acceptedAt) : acceptedAt;
	const updatedAtDate = isString(updatedAt) ? parseISO(updatedAt) : updatedAt;
	return isAfter(acceptedAtDate, updatedAtDate);
}
