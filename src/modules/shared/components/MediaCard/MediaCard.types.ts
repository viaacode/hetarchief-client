export interface GeneralMediaCardProps {
	description?: string;
	published_at?: Date;
	published_by?: string;
	title?: string;
	thumbnail?: string;
	preview?: string;
	type?: 'video' | 'audio' | 'meta';
	view: 'list' | 'grid';
}

export type TypeProps =
	| {
			thumbnail: string;
			type: 'video';
	  }
	| {
			preview: string;
			type: 'audio';
	  }
	| {
			type: 'meta';
	  };

export type MediaCardProps = GeneralMediaCardProps & TypeProps;
