import { useState } from 'react';

interface HoverProps {
	onMouseEnter: () => void;
	onMouseLeave: () => void;
}

const useHover = (): [boolean, HoverProps] => {
	const [hovering, setHovering] = useState(false);
	const onHoverProps = {
		onMouseEnter: () => setHovering(true),
		onMouseLeave: () => setHovering(false),
	};

	return [hovering, onHoverProps];
};

export default useHover;
