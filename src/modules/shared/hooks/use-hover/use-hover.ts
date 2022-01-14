import { useState } from 'react';

import { HoverProps } from './use-hover.types';

const useHover = (): [boolean, HoverProps] => {
	const [hovering, setHovering] = useState(false);
	const onHoverProps = {
		onMouseEnter: () => setHovering(true),
		onMouseLeave: () => setHovering(false),
	};

	return [hovering, onHoverProps];
};

export default useHover;
