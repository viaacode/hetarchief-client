import { isAfter } from 'date-fns';

export function isCurrentTosAccepted(
	acceptedAt: Date | string | null,
	updatedAt: Date | string
): boolean {
	if (!acceptedAt) {
		return false;
	}
	return isAfter(new Date(acceptedAt), new Date(updatedAt));
}
