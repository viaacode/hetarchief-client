import { default as NextLink } from 'next/link';
import { FC } from 'react';

import { NextLinkWrapperProps } from './NextLinkWrapper.types';

const NextLinkWrapper: FC<NextLinkWrapperProps> = ({ className, href, children }) => {
	return (
		<NextLink passHref href={href}>
			<a className={className}>{children}</a>
		</NextLink>
	);
};
export default NextLinkWrapper;
