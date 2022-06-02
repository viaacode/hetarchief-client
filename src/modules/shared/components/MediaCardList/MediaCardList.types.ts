import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

import { MediaCardProps } from '../MediaCard/MediaCard.types';

export interface MediaCardListProps
	extends Pick<MediaCardProps, 'view' | 'keywords'>,
		DefaultComponentProps {
	items?: MediaCardProps[];
	sidebar?: ReactNode;
	breakpoints?: Record<number | 'default', number>;
	buttons?: (item: MediaCardProps) => ReactNode;
	actions?: (item: MediaCardProps) => ReactNode;
	wrapper?: (card: ReactNode, item: MediaCardProps) => ReactNode;
}
