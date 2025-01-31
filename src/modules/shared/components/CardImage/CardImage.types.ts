import type { ReactNode } from 'react';

import type { DefaultComponentProps } from '@shared/types';

export interface CardImageProps extends DefaultComponentProps {
	children?: ReactNode;
	color?: string | null;
	image?: string | null;
	logo?: string | null;
	name?: string;
	id?: string;
	size?: 'short' | 'tall' | 'small';
	shadow?: boolean;
	unoptimized?: boolean;
}
