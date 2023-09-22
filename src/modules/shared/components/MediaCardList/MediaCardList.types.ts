import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

import { IdentifiableMediaCard, MediaCardProps } from '../MediaCard/MediaCard.types';

export interface MediaCardListProps
	extends Pick<MediaCardProps, 'view' | 'keywords'>,
		DefaultComponentProps {
	children?: React.ReactNode;
	items?: IdentifiableMediaCard[];
	sidebar?: ReactNode;
	breakpoints?: Record<number | 'default', number>;
	renderButtons?: (item: MediaCardProps) => ReactNode;
	renderActions?: (item: MediaCardProps) => ReactNode;
	renderWrapper?: (card: ReactNode, item: MediaCardProps) => ReactNode;
	showLocallyAvailable?: boolean;
	tempAccessLabel?: ReactNode;
	showManyResultsTile?: boolean;
}
