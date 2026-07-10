import { selectHasAcceptedTosAt } from '@auth/store/user';
import { selectTosUpdatedAt } from '@shared/store/tos';
import { isCurrentTosAccepted } from '@shared/utils/tos';
import { useSelector } from 'react-redux';

export const useTermsOfService = (): boolean => {
	const tosAcceptedAt = useSelector(selectHasAcceptedTosAt);
	const tosUpdatedAt = useSelector(selectTosUpdatedAt);

	return !!(tosAcceptedAt && tosUpdatedAt && isCurrentTosAccepted(tosAcceptedAt, tosUpdatedAt));
};
