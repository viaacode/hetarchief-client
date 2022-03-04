import { MouseEvent, ReactNode } from 'react';

import { MediaCardProps } from '../MediaCard/MediaCard.types';

export interface MediaCardListProps extends Pick<MediaCardProps, 'view' | 'actions'> {
	items?: MediaCardProps[];
	keywords?: string[];
	sidebar?: ReactNode;
	breakpoints?: Record<number | 'default', number>;
	onItemBookmark?: (data: { e: MouseEvent<HTMLButtonElement>; item: MediaCardProps }) => void;
	onItemTitleClick?: (data: { item: MediaCardProps }) => void;
}
