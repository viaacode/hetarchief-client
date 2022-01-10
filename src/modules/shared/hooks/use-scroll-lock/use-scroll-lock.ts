import { useEffect, useRef } from 'react';

import { UseScrollLock } from './use-scroll-lock.types';

const useScrollLock: UseScrollLock = (element, lock) => {
	const prevOverflowStyle = useRef<string>('');

	useEffect(() => {
		if (!element) {
			return;
		}

		if (!prevOverflowStyle.current) {
			prevOverflowStyle.current = element.style.overflow;
			console.log('prev', prevOverflowStyle.current);
		}

		if (lock) {
			element.style.overflow = 'hidden';
		} else {
			element.style.overflow = prevOverflowStyle.current;
		}

		return () => {
			element.style.overflow = prevOverflowStyle.current;
		};
	}, [element, lock]);
};

export default useScrollLock;
