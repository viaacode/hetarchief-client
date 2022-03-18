import { formatWithLocale } from '@shared/utils';

export const formatApproveRequestAccessDate = (date?: Date): string => {
	return formatWithLocale('P', date);
};

export const formatApproveRequestAccessTime = (date?: Date): string => {
	return formatWithLocale('p', date);
};
