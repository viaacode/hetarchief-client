import { mapDcTermsFormatToSimpleType } from '@meemoo/admin-core-ui/admin';
import type { HetArchiefIeObjectType } from '@viaa/avo2-types';

/**
 * Where the object was played, so plays on an object's own page can be told apart from plays of
 * objects embedded in a content page (carousel, video block, timeline).
 * https://meemoo.atlassian.net/browse/ARC-3877
 */
export enum PlayEventPageType {
	OBJECT_DETAIL = 'OBJECT_DETAIL',
	CONTENT_PAGE = 'CONTENTPAGINA',
}

export interface PlayEventDataInput {
	dctermsFormat: HetArchiefIeObjectType | null | undefined;
	schemaIdentifier: string | undefined;
	maintainerId: string | undefined;
	pageType: PlayEventPageType;
	/** Whether the played media was cut to a snippet by the config of the content block it sits in */
	isBlockSnippet: boolean;
}

/**
 * The `data` payload of the item play events, kept in one place so the object detail page and the
 * content page blocks can't drift apart on the param names.
 */
export function mapPlayEventData({
	dctermsFormat,
	schemaIdentifier,
	maintainerId,
	pageType,
	isBlockSnippet,
}: PlayEventDataInput): Record<string, unknown> {
	return {
		type: mapDcTermsFormatToSimpleType(dctermsFormat) || 'unknown',
		fragment_id: schemaIdentifier,
		pid: schemaIdentifier,
		or_id: maintainerId,
		page_type: pageType,
		is_block_snippet: isBlockSnippet,
	};
}
