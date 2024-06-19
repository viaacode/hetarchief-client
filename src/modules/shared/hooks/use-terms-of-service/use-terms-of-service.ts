import { useSelector } from 'react-redux';

import { selectHasAcceptedTosAt } from '@auth/store/user';
import { selectTosUpdatedAt } from '@shared/store/tos';
import { isCurrentTosAccepted } from '@shared/utils/tos';

export const useTermsOfService = (): boolean => {
	const tosAcceptedAt = useSelector(selectHasAcceptedTosAt);
	const tosUpdatedAt = useSelector(selectTosUpdatedAt);

	return !!(tosAcceptedAt && tosUpdatedAt && isCurrentTosAccepted(tosAcceptedAt, tosUpdatedAt));
};
