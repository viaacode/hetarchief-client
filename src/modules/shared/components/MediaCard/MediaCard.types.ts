import { MouseEventHandler, ReactNode } from 'react';

export type MediaCardViewMode = 'list' | 'grid';

export interface MediaCardProps {
	bookmarkIsSolid?: boolean;
	description?: ReactNode;
	keywords?: string[];
	preview?: string;
	publishedAt?: Date;
	publishedBy?: string;
	title?: string;
	type?: 'video' | 'audio';
	view?: MediaCardViewMode;
	onBookmark?: MouseEventHandler<HTMLButtonElement>;
}

export type IdentifiableMediaCard = MediaCardProps & { id: string };
