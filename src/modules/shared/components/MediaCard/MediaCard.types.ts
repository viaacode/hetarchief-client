import { ReactNode } from 'react';

import { MediaTypes } from '@shared/types';

export type MediaCardViewMode = 'list' | 'grid';

export interface MediaCardProps {
	actions?: ReactNode;
	buttons?: ReactNode;
	description?: ReactNode;
	keywords?: string[];
	name?: string;
	preview?: string;
	publishedAt?: Date;
	publishedBy?: string;
	title?: string | ReactNode;
	type: MediaTypes;
	view?: MediaCardViewMode;
}

export type IdentifiableMediaCard = MediaCardProps & {
	schemaIdentifier: string;
};
