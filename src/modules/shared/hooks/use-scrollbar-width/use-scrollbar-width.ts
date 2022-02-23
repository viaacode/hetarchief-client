import { useEffect, useRef } from 'react';

const useScrollbarWidth = (): number => {
	const scrollbarWidth = useRef(0);
	useEffect(() => {
		if (!scrollbarWidth.current && window && document) {
			scrollbarWidth.current = document.body.offsetWidth - document.body.clientWidth;
		}
	});
	return scrollbarWidth.current;
};

export default useScrollbarWidth;
