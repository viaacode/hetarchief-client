import { useEffect } from 'react';

import { UseScrollLock } from './use-scroll-lock.types';

const useScrollLock: UseScrollLock = (lock, element) => {
	useEffect(() => {
		const scrollbarWidth =
			document && window ? document.body.offsetWidth - document.body.clientWidth : 0;

		const elementToLock = element ?? document.body.parentElement ?? document.body;
		let prevOverflowStyle = '';
		let prevMarginStyle = '';

		if (!prevOverflowStyle) {
			prevOverflowStyle = elementToLock.style.overflow;
		}
		if (!prevMarginStyle) {
			prevMarginStyle = elementToLock.style.marginRight;
		}

		if (lock) {
			elementToLock.style.overflow = 'hidden';
			elementToLock.style.marginRight = prevMarginStyle
				? `${prevMarginStyle + scrollbarWidth}px`
				: `${scrollbarWidth}px`;
		} else {
			elementToLock.style.overflow = prevOverflowStyle;
			elementToLock.style.marginRight = prevMarginStyle;
		}

		return () => {
			elementToLock.style.overflow = prevOverflowStyle;
			elementToLock.style.marginRight = prevMarginStyle;
		};
	}, [element, lock]);
};

export default useScrollLock;
