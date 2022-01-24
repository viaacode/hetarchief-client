import { createContext } from 'react';

import { INITIAL_BLADE_MANAGER_CONTEXT_VALUE } from './BladeManagerContext.const';

const BladeManagerContext = createContext(INITIAL_BLADE_MANAGER_CONTEXT_VALUE);

export default BladeManagerContext;
