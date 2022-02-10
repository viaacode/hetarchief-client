export interface MediaInfo {
	schema_in_language: any;
	dcterms_available: string;
	schema_creator?: {
		Archiefvormer?: string[];
		productionCompany?: string[];
		Maker?: string[];
	};
	schema_identifier: string;
	schema_description?: string;
	schema_publisher?: {
		Publisher: string[];
	};
	schema_duration: string;
	schema_abstract?: string;
	premis_identifier: string;
	schema_genre?: string;
	schema_date_published?: string;
	schema_license?: string[];
	schema_date_created?: string;
	schema_contributor: any;
	schema_maintainer: {
		schema_identifier: string;
	}[];
	dcterms_format: 'video' | 'audio' | null;
	schema_name: string;
}

export class MediaSearchFilters {
	query?: string;
}
