import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

import { IdentifiableMediaCard, MediaCardProps } from '../MediaCard/MediaCard.types';

export interface MediaCardListProps
	extends Pick<MediaCardProps, 'view' | 'keywords'>,
		DefaultComponentProps {
	items?: IdentifiableMediaCard[];
	sidebar?: ReactNode;
	breakpoints?: Record<number | 'default', number>;
	buttons?: (item: MediaCardProps) => ReactNode;
	actions?: (item: MediaCardProps) => ReactNode;
	wrapper?: (card: ReactNode, item: MediaCardProps) => ReactNode;
	showLocallyAvailable?: boolean;
	tempAccessLabel?: ReactNode;
	showManyResultsTile?: boolean;
}
