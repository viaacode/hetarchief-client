export enum ReadingRoomMediaType {
	All = 'all',
	Audio = 'audio',
	Video = 'video',
}

export enum ReadingRoomSort {
	Date = 'date',
	Relevance = 'relevance',
	Title = 'title',
}

export interface DefaultFilterFormProps {
	name: string;
}

export interface ReadingRoomInfo {
	id: string;
	maintainerId: string;
	name: string;
	description: string | null;
	serviceDescription: string | null;
	image: string | null;
	color: string | null;
	logo: string;
	audienceType: string;
	publicAccess: boolean;
	contactInfo: {
		email: string | null;
		telephone: string | null;
		address: {
			street: string;
			postalCode: string;
			locality: string;
		};
	};
	isPublished: boolean;
	publishedAt: string | null;
	createdAt: string;
	updatedAt: string;
}
