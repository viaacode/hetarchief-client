import { isAfter } from 'date-fns';

export function isCurrentTosAccepted(acceptedAt: Date | string, updatedAt: Date | string): boolean {
	return isAfter(new Date(acceptedAt), new Date(updatedAt));
}
