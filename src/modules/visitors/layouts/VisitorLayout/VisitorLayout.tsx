import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setShowZendesk } from '@shared/store/ui';

/**
 * Layout to wrap all pages for visitors (eg: not cp admin, not meemoo admin, but visitor pages)
 * @param className
 * @param children
 * @constructor
 */
const VisitorLayout: FC = ({ children }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setShowZendesk(true));
	}, [dispatch]);

	return <>{children}</>;
};

export default VisitorLayout;
