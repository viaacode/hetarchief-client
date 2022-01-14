import { createContext } from 'react';

import { INITIAL_WINDOW_SIZE_CONTEXT_VALUE } from './WindowSizeContext.const';

/**
 * Use context for window resize event instead of hook to prevent multiple listeners triggering
 * state updates.
 * Only wrap this provider inside pages once. Move it higher in the page's tree when more components
 * need it. Use it in conjunction with the useWindowSize hook to provide the value.
 */
const WindowSizeContext = createContext(INITIAL_WINDOW_SIZE_CONTEXT_VALUE);

export default WindowSizeContext;
