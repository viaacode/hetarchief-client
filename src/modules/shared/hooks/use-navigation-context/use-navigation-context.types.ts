import { NavigationContextValue } from '@shared/context/NavigationContext/NavigationContext.types';

export interface UseNavigationContextProps {
	isBordered?: boolean;
}

export type UseNavigationContext = (props?: UseNavigationContextProps) => NavigationContextValue;
