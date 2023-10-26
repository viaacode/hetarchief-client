import { useSelector } from 'react-redux';

import { selectHasAcceptedTosAt } from '@auth/store/user/user.select';
import { selectTosUpdatedAt } from '@shared/store/tos/tos.select';
import { isCurrentTosAccepted } from '@shared/utils';

export const useTermsOfService = (): boolean => {
	const tosAcceptedAt = useSelector(selectHasAcceptedTosAt);
	const tosUpdatedAt = useSelector(selectTosUpdatedAt);

	return !!(tosAcceptedAt && tosUpdatedAt && isCurrentTosAccepted(tosAcceptedAt, tosUpdatedAt));
};
