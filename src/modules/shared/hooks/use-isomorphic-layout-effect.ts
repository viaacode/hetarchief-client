import { useEffect, useLayoutEffect } from 'react';

/**
 * Use workaround to avoid warning about using useLayoutEffect inside Server Side Rendered components:
 *
 * Warning: useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer’s output format.
 * This will lead to a mismatch between the initial, non-hydrated UI and the intended UI. To avoid this,
 * useLayoutEffect should only be used in components that render exclusively on the client. See https://fb.me/react-uselayouteffect-ssr for common fixes.
 *
 * see: https://medium.com/@alexandereardon/uselayouteffect-and-ssr-192986cdcf7a
 */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
export default useIsomorphicLayoutEffect;
