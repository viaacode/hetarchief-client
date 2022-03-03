import { ReactNode } from 'react';

import { MediaCardProps } from '../MediaCard/MediaCard.types';

export interface MediaCardListProps extends Pick<MediaCardProps, 'view'> {
	items?: MediaCardProps[];
	keywords?: string[];
	sidebar?: ReactNode;
	breakpoints?: Record<number | 'default', number>;
}
