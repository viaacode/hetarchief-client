import { MouseEvent, ReactNode } from 'react';

export type MediaCardViewMode = 'list' | 'grid';

export interface MediaCardProps {
	bookmarkIsSolid?: boolean;
	description?: ReactNode;
	keywords?: string[];
	detailLink: string;
	preview?: string;
	publishedAt?: Date;
	publishedBy?: string;
	title?: string;
	type?: 'video' | 'audio';
	view?: MediaCardViewMode;
	onBookmark?: (evt: MouseEvent) => void;
	actions?: ReactNode;
}

export type IdentifiableMediaCard = MediaCardProps & {
	meemooFragmentId: string;
};
