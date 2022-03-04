import { useEffect, useState } from 'react';

const useScrollbarWidth = (trigger: boolean): number => {
	const [scrollbarWidth, setScrollbarWidth] = useState(0);

	useEffect(() => {
		setScrollbarWidth(document.body.offsetWidth - document.body.clientWidth);
	}, [trigger]);

	return scrollbarWidth;
};

export default useScrollbarWidth;
