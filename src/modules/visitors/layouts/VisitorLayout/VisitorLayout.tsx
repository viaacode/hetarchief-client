import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { GroupName } from '@account/const';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { setShowZendesk } from '@shared/store/ui';

/**
 * Layout to wrap all pages for visitors (eg: not cp admin, not meemoo admin, but visitor pages)
 * @param className
 * @param children
 * @constructor
 */
const VisitorLayout: FC = ({ children }) => {
	const dispatch = useDispatch();
	const isKioskUser = useHasAnyGroup(GroupName.KIOSK_VISITOR);

	useEffect(() => {
		dispatch(setShowZendesk(!isKioskUser));
	}, [dispatch]);

	return <>{children}</>;
};

export default VisitorLayout;
