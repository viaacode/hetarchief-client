import {
	type IeObject,
	IeObjectAccessThrough,
	type IeObjectRightsInfo,
} from '@ie-objects/ie-objects.types';
import { IeObjectType } from '@shared/types/ie-objects';
import { Locale } from '@shared/utils/i18n';
import { compact } from 'lodash-es';

const MISSING_RIGHTS_INFO = 'geen rechteninformatie beschikbaar';
const UNKNOWN_CREATOR_BY_LOCALE: Record<Locale, string> = {
	[Locale.nl]: 'Onbekende maker',
	[Locale.en]: 'Unknown creator',
};
const ESSENCE_ACCESS_ROUTES = [
	IeObjectAccessThrough.PUBLIC_INFO,
	IeObjectAccessThrough.SECTOR,
	IeObjectAccessThrough.VISITOR_SPACE_FULL,
	IeObjectAccessThrough.VISITOR_SPACE_FOLDERS,
];
const AV_OBJECT_TYPES = [
	IeObjectType.AUDIO,
	IeObjectType.AUDIO_FRAGMENT,
	IeObjectType.FILM,
	IeObjectType.VIDEO,
	IeObjectType.VIDEO_FRAGMENT,
];

function splitNameList(value: string): string[] {
	return value
		.split(/[;,]/)
		.map((name) => name.trim())
		.filter(Boolean);
}

function flattenValue(value: unknown): string[] {
	if (!value) {
		return [];
	}

	if (typeof value === 'string') {
		return splitNameList(value);
	}

	if (Array.isArray(value)) {
		return value.flatMap(flattenValue);
	}

	if (typeof value === 'object') {
		return Object.values(value).flatMap(flattenValue);
	}

	return [];
}

function getObjectValuesByKey(value: unknown, keys: string[]): string[] {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return flattenValue(value);
	}

	const normalizedKeys = keys.map((key) => key.toLowerCase());

	return Object.entries(value).flatMap(([key, entryValue]) => {
		const normalizedKey = key.toLowerCase();
		return normalizedKeys.some((candidate) => normalizedKey.includes(candidate))
			? flattenValue(entryValue)
			: [];
	});
}

function getCreatorNames(ieObject: IeObject, locale: Locale): string[] {
	const copyrightHolders = flattenValue(ieObject.copyrightHolder);

	if (copyrightHolders.length > 0) {
		return copyrightHolders;
	}

	const makers =
		ieObject.creator && typeof ieObject.creator === 'object' && !Array.isArray(ieObject.creator)
			? Object.entries(ieObject.creator).flatMap(([key, value]) => {
					const normalizedKey = key.toLowerCase();
					return normalizedKey.includes('production') ||
						normalizedKey.includes('producer') ||
						normalizedKey.includes('producent') ||
						normalizedKey.includes('broadcast') ||
						normalizedKey.includes('omroep')
						? []
						: flattenValue(value);
				})
			: flattenValue(ieObject.creator);

	if (makers.length > 0) {
		return makers;
	}

	const producers = getObjectValuesByKey(ieObject.creator, ['production', 'producer', 'producent']);

	if (producers.length > 0) {
		return producers;
	}

	const broadcasters = flattenValue(ieObject.rightsInfo?.broadcastingOrganization);

	return broadcasters.length > 0 ? broadcasters : [UNKNOWN_CREATOR_BY_LOCALE[locale]];
}

export function formatSourceAttributionNames(names: string[]): string {
	const uniqueNames = Array.from(new Set(names.map((name) => name.trim()).filter(Boolean)));

	if (uniqueNames.length <= 1) {
		return uniqueNames[0] || '';
	}

	if (uniqueNames.length <= 3) {
		return `${uniqueNames.slice(0, -1).join(', ')} en ${uniqueNames.at(-1)}`;
	}

	return `${uniqueNames.slice(0, 3).join(', ')}, e.a.`;
}

function getUsageCategory(rightsInfo?: IeObjectRightsInfo | null): string {
	return rightsInfo?.reuseCategoryLabel || MISSING_RIGHTS_INFO;
}

function hasEssenceAccess(ieObject: IeObject): boolean {
	return (ieObject.accessThrough || []).some((accessRoute) =>
		ESSENCE_ACCESS_ROUTES.includes(accessRoute)
	);
}

function hasNewspaperEssence(ieObject: IeObject): boolean {
	return !!ieObject.thumbnailUrl || !!ieObject.pages?.length;
}

function hasAvEssence(ieObject: IeObject): boolean {
	return !!ieObject.thumbnailUrl || !!ieObject.meemooMediaObjectId;
}

function buildAttribution(parts: Array<string | null | undefined>): string {
	return `${compact(parts).join(', ')}.`;
}

export function getIeObjectSourceAttribution(
	ieObject: IeObject,
	locale: Locale = Locale.nl
): string | null {
	if (!hasEssenceAccess(ieObject)) {
		return null;
	}

	if (AV_OBJECT_TYPES.includes(ieObject.dctermsFormat) && hasAvEssence(ieObject)) {
		return buildAttribution([
			formatSourceAttributionNames(getCreatorNames(ieObject, locale)),
			ieObject.name,
			ieObject.dateCreated || ieObject.datePublished,
			ieObject.maintainerName,
			getUsageCategory(ieObject.rightsInfo),
			'hetarchief.be',
		]);
	}

	if (ieObject.dctermsFormat === IeObjectType.NEWSPAPER && hasNewspaperEssence(ieObject)) {
		return buildAttribution([
			ieObject.name,
			ieObject.dateCreated || ieObject.datePublished,
			ieObject.maintainerName,
			getUsageCategory(ieObject.rightsInfo),
			'hetarchief.be',
		]);
	}

	return null;
}
