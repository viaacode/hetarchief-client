import { useSelector } from 'react-redux';

import { selectHasAcceptedTosAt } from '@auth/store/user';
import { selectTosUpdatedAt } from '@shared/store/tos';
import { isCurrentTosAccepted } from '@shared/utils';

import { UseTermsOfService } from './use-terms-of-service.types';

const useTermsOfService: UseTermsOfService = () => {
	const tosAcceptedAt = useSelector(selectHasAcceptedTosAt);
	const tosUpdatedAt = useSelector(selectTosUpdatedAt);

	return !!(tosAcceptedAt && tosUpdatedAt && isCurrentTosAccepted(tosAcceptedAt, tosUpdatedAt));
};

export default useTermsOfService;
