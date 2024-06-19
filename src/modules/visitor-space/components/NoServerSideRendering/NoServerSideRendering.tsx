import { type FC, type ReactNode, useEffect, useState } from 'react';

interface NoSsrProps {
	children: ReactNode;
}

export const NoServerSideRendering: FC<NoSsrProps> = ({ children }) => {
	const [renderChildren, setRenderChildren] = useState<boolean>(false);

	useEffect(() => {
		setRenderChildren(true);
	}, []);

	return renderChildren ? children : null;
};
