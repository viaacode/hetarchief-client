import useResizeObserver from '@react-hook/resize-observer';
import { useLayoutEffect, useState } from 'react';

import { UseElementSize } from './use-element-size.types';

const useElementSize: UseElementSize = (target) => {
	const [size, setSize] = useState<DOMRect>();

	useLayoutEffect(() => {
		setSize(target.current?.getBoundingClientRect());
	}, [target]);

	useResizeObserver(target, (entry) => setSize(entry.contentRect));
	return size;
};

export default useElementSize;
