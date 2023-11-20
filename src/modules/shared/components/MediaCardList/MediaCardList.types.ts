import { ReactNode } from 'react';

import { IdentifiableMediaCard, MediaCardProps } from '@shared/components';
import { DefaultComponentProps } from '@shared/types';

export interface MediaCardListProps
	extends Pick<MediaCardProps, 'view' | 'keywords'>,
		DefaultComponentProps {
	children?: ReactNode;
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
