import useResizeObserver from '@react-hook/resize-observer';
import useIsomorphicLayoutEffect from '@shared/hooks/use-isomorphic-layout-effect';
import type { RefObject } from 'react';
import { useState } from 'react';

import type { UseElementSize } from './use-element-size.types';

const useElementSize: UseElementSize = (target) => {
	const [size, setSize] = useState<DOMRect>();

	useIsomorphicLayoutEffect(() => {
		setSize(target.current?.getBoundingClientRect());
	}, [target]);

	// @react-hook/resize-observer's types predate React 19's `RefObject<T | null>`, but it
	// safely handles a null `target.current` at runtime.
	useResizeObserver(target as RefObject<HTMLElement>, (entry) => setSize(entry.contentRect));
	return size;
};

export default useElementSize;
