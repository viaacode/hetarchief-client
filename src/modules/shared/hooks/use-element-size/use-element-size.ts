import useResizeObserver from '@react-hook/resize-observer';
import useIsomorphicLayoutEffect from '@shared/hooks/use-isomorphic-layout-effect';
import { useState } from 'react';

import type { UseElementSize } from './use-element-size.types';

const useElementSize: UseElementSize = (target) => {
	const [size, setSize] = useState<DOMRect>();

	useIsomorphicLayoutEffect(() => {
		setSize(target.current?.getBoundingClientRect());
	}, [target]);

	useResizeObserver(target, (entry) => setSize(entry.contentRect));
	return size;
};

export default useElementSize;
