import { useContext } from 'react';

import NavigationContext from '@shared/context/NavigationContext/NavigationContext';

import { UseNavigationContext } from './use-navigation-context.types';

const useNavigationContext: UseNavigationContext = (props) => {
	const navigationContext = useContext(NavigationContext);
	props &&
		props.isBordered !== undefined &&
		navigationContext.setNavigationBorderBottom(props.isBordered);

	return navigationContext;
};

export default useNavigationContext;
