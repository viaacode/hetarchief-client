import type { AvoSearchOrderDirection } from '@viaa/avo2-types';

/**
 * A theme: an editorially managed, bilingual label that groups publicly disclosed ie-objects.
 * Managed by meemoo admins, see ARC-3798 / ARC-3799.
 */
export interface Theme {
	id: string;
	/** Only used in content management, never shown in the front end */
	slug: string;
	nameNl: string;
	nameEn: string;
	descriptionNl: string | null;
	descriptionEn: string | null;
	/** Default thumbnail, always rendered 16:9 */
	imageUrl: string | null;
	/** Internal path on hetarchief.be to the theme detail page */
	contentPagePathNl: string | null;
	contentPagePathEn: string | null;
	/** Null for themes coming from the random order view, which does not expose it */
	updatedAt: string | null;
}

/** The properties a theme can be sorted on. Mirrors ThemeOrderProp in the proxy. */
export enum ThemeOrderProp {
	slug = 'slug',
	nameNl = 'nameNl',
	nameEn = 'nameEn',
	updatedAt = 'updatedAt',
}

export interface GetThemesProps {
	search?: string;
	page?: number;
	size?: number;
	orderProp?: ThemeOrderProp;
	orderDirection?: AvoSearchOrderDirection;
}

/** An ie-object linked to a theme, as shown in the "Gekoppelde objecten" table */
export interface ThemeIeObject {
	/** The intellectual entity id (uri). Environment specific, never shown or submitted */
	id: string;
	/** The short identifier shown in the UI and used to link/unlink */
	schemaIdentifier: string | null;
	name: string | null;
	format: string | null;
	thumbnailUrl: string | null;
	maintainerId: string | null;
	maintainerName: string | null;
}

/** Response of GET /themes/:uuid/ie-objects: the theme plus a page of its linked objects */
export interface ThemeWithIeObjects extends Theme {
	ieObjects: ThemeIeObject[];
	/** Null when random order was requested */
	total: number | null;
}

export interface GetThemeIeObjectsProps {
	themeId: string;
	page?: number;
	size?: number;
}

/** The fields a meemoo admin can manage. `file` is the newly picked thumbnail, if any. */
export interface ThemeFormValues {
	slug: string;
	nameNl: string;
	nameEn: string;
	descriptionNl: string | null;
	descriptionEn: string | null;
	contentPagePathNl: string | null;
	contentPagePathEn: string | null;
	/** Existing thumbnail url, or a local preview url for a freshly picked file */
	imageUrl: string | null;
	/** Only set when the admin picked a new file; sent as multipart */
	file?: File | null;
}

/** Mirrors AddIeObjectToThemeResult in the proxy */
export enum AddIeObjectResult {
	added = 'added',
	alreadyLinked = 'alreadyLinked',
	notFound = 'notFound',
}

/** One result per submitted schema identifier, in submission order */
export interface AddIeObjectsResultItem {
	schemaIdentifier: string;
	result: AddIeObjectResult;
}
