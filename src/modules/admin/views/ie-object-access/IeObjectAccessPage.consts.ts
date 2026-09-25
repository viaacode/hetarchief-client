import { GroupName } from '@account/const';
import {
	FLOWPLAYER_AUDIO_FORMATS,
	FLOWPLAYER_VIDEO_FORMATS,
	IMAGE_API_FORMATS,
	JSON_FORMATS,
} from '@ie-objects/ie-objects.consts';
import { HetArchiefIeObjectAccessThrough, HetArchiefIeObjectLicense } from '@viaa/avo2-types';
import { StringParam, withDefault } from 'use-query-params';

import {
	CheckAccessFor,
	IeObjectAccessGrantedThrough,
	IeObjectMetadataSet,
	IeObjectNotVisibleReason,
} from './IeObjectAccessPage.types';

// This is an undocumented debug page for meemoo admins, so the texts are not translated

export const PAGE_TITLE = 'Object access debugger';

export const QUERY_PARAM_CONFIG = {
	pid: withDefault(StringParam, ''),
	for: withDefault(StringParam, CheckAccessFor.ME),
	email: withDefault(StringParam, ''),
};

export const LICENSE_EXPLANATIONS: Record<string, string> = {
	[HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD]:
		'Everyone (also people who are not logged in) may see the basic description of the object.',
	[HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL]:
		'Everyone (also people who are not logged in) may see the full description of the object.',
	[HetArchiefIeObjectLicense.PUBLIEK_CONTENT]:
		'Everyone may see the full description and also view/listen to the object itself.',
	[HetArchiefIeObjectLicense.BEZOEKERTOOL_METADATA_ALL]:
		"People with approved access to this content partner's visitor space (reading room) may see the full description.",
	[HetArchiefIeObjectLicense.BEZOEKERTOOL_CONTENT]:
		"People with approved access to this content partner's visitor space (reading room) may see the full description and view/listen to the object itself.",
	[HetArchiefIeObjectLicense.INTRA_CP_METADATA_LTD]:
		'Key users of other content partner organisations may see the basic description (depending on the sectors involved).',
	[HetArchiefIeObjectLicense.INTRA_CP_METADATA_ALL]:
		'Key users of other content partner organisations may see the full description (depending on the sectors involved).',
	[HetArchiefIeObjectLicense.INTRA_CP_CONTENT]:
		'Key users of other content partner organisations may see the full description and view/listen to the object (depending on the sectors involved).',
	[HetArchiefIeObjectLicense.PUBLIEK_METADATA_AI]:
		'The description may be used for AI purposes. This does not give anyone access on the platform.',
	[HetArchiefIeObjectLicense.INTRA_CP_METADATA_AI]:
		'The description may be used for AI purposes by content partners. This does not give anyone access on the platform.',
	[HetArchiefIeObjectLicense.PUBLIC_DOMAIN]:
		'Rights status: the object is in the public domain. This is information only, it does not give anyone access on the platform by itself.',
	[HetArchiefIeObjectLicense.COPYRIGHT_UNDETERMINED]:
		'Rights status: the copyright is not yet determined. This is information only, it does not give anyone access on the platform by itself.',
};

export const METADATA_SET_LABELS: Record<IeObjectMetadataSet, string> = {
	[IeObjectMetadataSet.EMPTY]: 'Nothing',
	[IeObjectMetadataSet.METADATA_LTD]: 'Basic description',
	[IeObjectMetadataSet.METADATA_ALL]: 'Full description',
	[IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE]: 'Full description + the media itself',
};

export const GROUP_LABELS: Record<string, string> = {
	[GroupName.ANONYMOUS]: 'Not logged in (anonymous visitor)',
	[GroupName.VISITOR]: 'Visitor (regular registered user)',
	[GroupName.KIOSK_VISITOR]: 'Kiosk (computer in a reading room)',
	[GroupName.CP_ADMIN]: 'Content partner admin',
	[GroupName.MEEMOO_ADMIN]: 'meemoo admin',
};

// Visitor spaces some user groups get access to on top of their approved visit requests
export const EXTRA_VISITOR_SPACE_ACCESS_BY_GROUP: Partial<Record<GroupName, string>> = {
	[GroupName.CP_ADMIN]: ', plus the own organisation for content partner admins',
	[GroupName.MEEMOO_ADMIN]: ', meemoo admins always have access to all visitor spaces',
};

export const ACCESS_THROUGH_LABELS: Record<string, string> = {
	[HetArchiefIeObjectAccessThrough.PUBLIC_INFO]: 'Public information',
	[HetArchiefIeObjectAccessThrough.SECTOR]:
		'Through the sector (agreement between content partners)',
	[HetArchiefIeObjectAccessThrough.VISITOR_SPACE_FOLDERS]:
		'Through the visitor space: access to specific objects/folders',
	[HetArchiefIeObjectAccessThrough.VISITOR_SPACE_FULL]:
		"Through the visitor space: full access to the content partner's reading room",
};

export const GRANTED_THROUGH_LABELS: Record<IeObjectAccessGrantedThrough, string> = {
	[IeObjectAccessGrantedThrough.PUBLIC]: 'Public (step 2)',
	[IeObjectAccessGrantedThrough.SECTOR]: 'Sector (step 3)',
	[IeObjectAccessGrantedThrough.VISITOR_SPACE]: 'Visitor space (step 4)',
};

export const NOT_VISIBLE_REASON_LABELS: Record<
	IeObjectNotVisibleReason,
	(maintainerName: string, isAnonymous: boolean) => string
> = {
	[IeObjectNotVisibleReason.NO_LICENSES]: () =>
		'The object has no licenses at all, so nobody can see it.',
	[IeObjectNotVisibleReason.KIOSK_OTHER_MAINTAINER]: () =>
		'Kiosk computers can only show objects of their own content partner, and this object belongs to another content partner.',
	[IeObjectNotVisibleReason.NO_PUBLIC_LICENSE]: () =>
		'The object has no public license (VIAA-PUBLIEK-...), so it is not public.',
	[IeObjectNotVisibleReason.SECTOR_CONDITIONS_NOT_MET]: () =>
		'The object can be shared between content partners (VIAA-INTRA_CP-...), but this user does not meet all conditions for that (see step 3).',
	[IeObjectNotVisibleReason.NO_VISITOR_SPACE_ACCESS]: (maintainerName, isAnonymous) =>
		`The object can be seen in the visitor space of ${maintainerName}, but this user has no approved, active visit to that visitor space${isAnonymous ? ' (you need to be logged in for that)' : ''}.`,
	[IeObjectNotVisibleReason.NO_MATCHING_LICENSE]: () =>
		'None of the licenses of the object match what this user is allowed to see.',
};

export const FIELD_LABELS: Record<string, string> = {
	name: 'Title',
	collectionName: 'Collection name',
	collectionId: 'Collection id',
	issueNumber: 'Issue number',
	meemooOriginalCp: 'Original content partner',
	iri: 'Object id (IRI)',
	schemaIdentifier: 'PID',
	premisIsPartOf: 'Is part of (premis)',
	fragmentId: 'Fragment id',
	meemooLocalId: 'Local id of the content partner',
	providerPurl: 'Link to the object on the website of the content partner',
	maintainerId: 'Content partner id',
	maintainerName: 'Content partner name',
	maintainerSlug: 'Content partner slug',
	maintainerLogo: 'Content partner logo',
	maintainerDescription: 'Content partner description',
	maintainerSiteUrl: 'Content partner website',
	maintainerFormUrl: 'Content partner request form',
	maintainerOverlay: 'Show content partner logo overlay',
	maintainerIiifAgreement: 'Content partner IIIF agreement',
	isPartOf: 'Is part of (series, program, archive, ...)',
	dctermsFormat: 'Type (video, audio, newspaper, ...)',
	dctermsMedium: 'Medium / carrier',
	duration: 'Duration',
	dateCreated: 'Date created',
	datePublished: 'Date published',
	creator: 'Creator(s)',
	description: 'Description',
	keywords: 'Keywords',
	inLanguage: 'Language',
	licenses: 'Licenses',
	carrierDate: 'Carrier date',
	numberOfPages: 'Number of pages',
	pageNumber: 'Page number',
	abrahamInfo: 'Abraham (newspaper catalogue) info',
	spatial: 'Location (spatial)',
	temporal: 'Period (temporal)',
	newspaperPublisher: 'Newspaper publisher',
	copyrightHolder: 'Copyright holder',
	children: 'Number of child objects',
	premisIdentifier: 'Other identifiers',
	ebucoreObjectType: 'Object type (ebucore)',
	abstract: 'Abstract',
	meemooDescriptionCast: 'Cast',
	meemooMediaObjectId: 'Media object id',
	publisher: 'Publisher(s)',
	alternativeTitle: 'Alternative title',
	preceededBy: 'Preceded by',
	succeededBy: 'Succeeded by',
	genre: 'Genre / category',
	width: 'Width',
	height: 'Height',
	digitizationDate: 'Digitization date',
	bibframeProductionMethod: 'Production method',
	bibframeEdition: 'Edition',
	synopsis: 'Synopsis',
	themes: 'Themes',
	thumbnailUrl: 'Thumbnail image',
	pages: 'Pages / representations / files (the media itself)',
	mentions: 'Mentions (names found in the text)',
	transcript: 'Transcript / full text',
	rightsInfo: 'Reuse rights info',
	sector: 'Sector of the content partner',
};

export const describeFileUsage = (mimeType: string): string => {
	if (FLOWPLAYER_VIDEO_FORMATS.includes(mimeType)) {
		return 'Video that can be played in the video player';
	}
	if (FLOWPLAYER_AUDIO_FORMATS.includes(mimeType)) {
		return 'Audio that can be played in the audio player';
	}
	if (IMAGE_API_FORMATS.includes(mimeType)) {
		return 'Image shown in the zoomable image viewer';
	}
	if (JSON_FORMATS.includes(mimeType)) {
		return 'Text recognition (OCR) data, used for searching and highlighting text';
	}
	if (mimeType?.startsWith('image/')) {
		return 'Image';
	}
	if (mimeType?.startsWith('video/')) {
		return 'Video (not in a format the player uses)';
	}
	if (mimeType?.startsWith('audio/')) {
		return 'Audio (not in a format the player uses)';
	}
	return 'Other file';
};

export const previewFieldValue = (field: string, value: unknown): string | null => {
	if (value === null || value === undefined || value === '') {
		return null;
	}
	if (field === 'pages' && Array.isArray(value)) {
		return `${value.length} page(s), see "Files and representations" above`;
	}
	const text = typeof value === 'string' ? value : JSON.stringify(value);
	return text.length > 160 ? `${text.substring(0, 160)}…` : text;
};
