import { isAfter } from 'date-fns';

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
	return isAfter(new Date(acceptedAt), new Date(updatedAt));
}
