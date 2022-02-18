import { createContext } from 'react';

import { INITIAL_NAVIGATION_CONTEXT_VALUE } from './NavigationContext.const';

const NavigationContext = createContext(INITIAL_NAVIGATION_CONTEXT_VALUE);

export default NavigationContext;
