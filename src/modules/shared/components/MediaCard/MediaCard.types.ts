export interface MediaCardProps {
	description?: string;
	published_at?: Date;
	published_by?: string;
	title?: string;
	preview?: string;
	type?: 'video' | 'audio';
	view: 'list' | 'grid';
}
