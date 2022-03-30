import { ReactNode } from 'react';

import { MediaTypes } from '@shared/types';

export type MediaCardViewMode = 'list' | 'grid';

export interface MediaCardProps {
	description?: ReactNode;
	keywords?: string[];
	preview?: string;
	publishedAt?: Date;
	publishedBy?: string;
	title?: string;
	type: MediaTypes;
	view?: MediaCardViewMode;
	actions?: ReactNode;
	buttons?: ReactNode;
}

export type IdentifiableMediaCard = MediaCardProps & {
	schemaIdentifier: string;
};
