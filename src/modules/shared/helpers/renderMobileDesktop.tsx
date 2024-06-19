import React, { type ReactNode } from 'react';

/**
 * Renders mobile parameter if width is < 700, renders desktop param in width is larger
 * @param children
 */
export function renderMobileDesktop(children: {
	mobile: ReactNode;
	desktop: ReactNode;
}): ReactNode {
	return (
		<>
			<div className="u-hide-gte-bp2">{children.mobile}</div>
			<div className="u-hide-lt-bp2">{children.desktop}</div>
		</>
	);
}
