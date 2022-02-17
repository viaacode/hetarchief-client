import { isBefore } from 'date-fns';

export function isCurrentTosAccepted(acceptedAt: Date | string, updatedAt: Date | string): boolean {
	return isBefore(new Date(acceptedAt), new Date(updatedAt));
}
