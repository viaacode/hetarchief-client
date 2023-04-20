import { useEffect, useState } from 'react';

const useScrollPosition = (): number => {
	const [currentScrollPosition, setCurrentScrollPosition] = useState(0);

	useEffect(() => {
		const updatePosition = () => {
			setCurrentScrollPosition(window.scrollY);
		};
		window.addEventListener('scroll', updatePosition);
		updatePosition();
		return () => window.removeEventListener('scroll', updatePosition);
	}, [currentScrollPosition]);

	return currentScrollPosition;
};

export default useScrollPosition;
