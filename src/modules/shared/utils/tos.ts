import { isAfter } from 'date-fns';

export function isCurrentTosAccepted(
	acceptedAt: Date | string | null | undefined,
	updatedAt: Date | string | null | undefined
): boolean {
	if (!acceptedAt) {
		return false;
	}
	if (!updatedAt) {
		console.error('No TOS_LAST_UPDATED_AT was set in the database. Allowing user to enter.');
		return true;
	}
	return isAfter(new Date(acceptedAt), new Date(updatedAt));
}
