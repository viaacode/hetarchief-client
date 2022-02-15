import { useEffect } from 'react';

import { UseScrollLock } from './use-scroll-lock.types';

const useScrollLock: UseScrollLock = (lock, element) => {
	useEffect(() => {
		const elementToLock = element ?? document.body;
		let prevOverflowStyle = '';
		let prevHeightStyle = '';

		if (!prevOverflowStyle) {
			prevOverflowStyle = elementToLock.style.overflow;
		}
		if (!prevHeightStyle) {
			prevHeightStyle = elementToLock.style.height;
		}

		if (lock) {
			elementToLock.style.overflow = 'hidden';
			elementToLock.style.height = '100vh';
		} else {
			elementToLock.style.overflow = prevOverflowStyle;
			elementToLock.style.height = prevHeightStyle;
		}

		return () => {
			elementToLock.style.overflow = prevOverflowStyle;
			elementToLock.style.height = prevHeightStyle;
		};
	}, [element, lock]);
};

export default useScrollLock;
