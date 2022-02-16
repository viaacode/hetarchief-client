import { useEffect } from 'react';

import useScrollbarWidth from '../use-scrollbar-width/use-scrollbar-width';

import { UseScrollLock } from './use-scroll-lock.types';

const useScrollLock: UseScrollLock = (lock, element) => {
	const scrollbarWidth = useScrollbarWidth();
	console.log(scrollbarWidth);

	useEffect(() => {
		const elementToLock = element ?? document.body;
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
