import { useEffect } from 'react';

import { UseScrollLock } from './use-scroll-lock.types';

const useScrollLock: UseScrollLock = (lock, element) => {
	useEffect(() => {
		const elementToLock = element ?? document.body;
		let prevOverflowStyle = '';

		if (!prevOverflowStyle) {
			prevOverflowStyle = elementToLock.style.overflow;
		}

		if (lock) {
			elementToLock.style.overflow = 'hidden';
		} else {
			elementToLock.style.overflow = prevOverflowStyle;
		}

		return () => {
			elementToLock.style.overflow = prevOverflowStyle;
		};
	}, [element, lock]);
};

export default useScrollLock;
