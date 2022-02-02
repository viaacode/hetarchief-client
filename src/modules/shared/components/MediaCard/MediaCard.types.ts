export type MediaCardViewMode = 'list' | 'grid';

export interface MediaCardProps {
	description?: string;
	published_at?: Date;
	published_by?: string;
	title?: string;
	preview?: string;
	type?: 'video' | 'audio';
	view: MediaCardViewMode;
	keywords?: string[];
}
