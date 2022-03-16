import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setShowZendesk } from '@shared/store/ui';
import { DefaultComponentProps } from '@shared/types';

/**
 * Layout to wrap all pages for visitors (eg: not cp admin, not meemoo admin, but visitor pages)
 * @param className
 * @param children
 * @constructor
 */
const VisitorLayout: FC<DefaultComponentProps> = ({ className, children }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setShowZendesk(true));
	}, [dispatch]);

	return <div className={className}>{children}</div>;
};

export default VisitorLayout;
