export type MediaCardViewMode = 'list' | 'grid';

export interface MediaCardProps {
	bookmarkIsSolid?: boolean;
	description?: string;
	keywords?: string[];
	preview?: string;
	publishedAt?: Date;
	publishedBy?: string;
	title?: string;
	type?: 'video' | 'audio';
	view?: MediaCardViewMode;
}
