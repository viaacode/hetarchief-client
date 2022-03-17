export type MediaTypes = 'video' | 'audio' | null;

export interface MediaInfo {
	schema_in_language: unknown | null;
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
	schema_contributor: unknown | null;
	schema_maintainer: {
		schema_identifier: string;
	}[];
	dcterms_format: MediaTypes;
	schema_name: string;
	// TODO: See if this is still necessary once resolved in proxy
	type?: string;
}
