import type { IeObject } from '@ie-objects/ie-objects.types';
import { Locale } from '@shared/utils/i18n';
import { compact, uniq } from 'lodash-es';

const PRODUCER_ROLE_PARTS = ['producer', 'producent', 'production'];
const BROADCASTER_ROLE_PARTS = ['broadcaster', 'omroep'];

function getLocalizedUnknownCreator(locale: Locale): string {
	return locale === Locale.en ? 'Unknown creator' : 'Onbekende maker';
}

function getLocalizedMissingRightsInfo(locale: Locale): string {
	return locale === Locale.en
		? 'no rights information available'
		: 'geen rechteninformatie beschikbaar';
}

function getLocalizedAnd(locale: Locale): string {
	return locale === Locale.en ? 'and' : 'en';
}

function normalizeRole(role: string): string {
	return role.toLowerCase();
}

function roleContains(role: string, parts: string[]): boolean {
	const normalizedRole = normalizeRole(role);

	return parts.some((part) => normalizedRole.includes(part));
}

function toTextValues(value: unknown): string[] {
	if (!value) {
		return [];
	}

	if (Array.isArray(value)) {
		return value.flatMap(toTextValues);
	}

	if (typeof value === 'object') {
		return Object.values(value).flatMap(toTextValues);
	}

	return String(value)
		.split(/[,;]/)
		.map((part) => part.trim())
		.filter(Boolean);
}

function getCreatorValuesByRole(
	creator: unknown,
	shouldIncludeRole: (role: string) => boolean
): string[] {
	if (!creator || typeof creator !== 'object' || Array.isArray(creator)) {
		return [];
	}

	return Object.entries(creator).flatMap(([role, value]) =>
		shouldIncludeRole(role) ? toTextValues(value) : []
	);
}

function getAttributionCreatorNames(ieObject: IeObject): string[] {
	const copyrightHolderValues = toTextValues(ieObject.copyrightHolder);
	if (copyrightHolderValues.length > 0) {
		return copyrightHolderValues;
	}

	const makerValues = getCreatorValuesByRole(
		ieObject.creator,
		(role) =>
			!roleContains(role, PRODUCER_ROLE_PARTS) && !roleContains(role, BROADCASTER_ROLE_PARTS)
	);
	if (makerValues.length > 0) {
		return makerValues;
	}

	const producerValues = getCreatorValuesByRole(ieObject.creator, (role) =>
		roleContains(role, PRODUCER_ROLE_PARTS)
	);
	if (producerValues.length > 0) {
		return producerValues;
	}

	return toTextValues(ieObject.maintainerName);
}

export function formatAvRightsAttributionNames(names: string[], locale: Locale): string {
	const uniqueNames = uniq(compact(names.map((name) => name.trim())));

	if (uniqueNames.length === 0) {
		return getLocalizedUnknownCreator(locale);
	}

	if (uniqueNames.length === 1) {
		return uniqueNames[0];
	}

	if (uniqueNames.length === 2) {
		return `${uniqueNames[0]} ${getLocalizedAnd(locale)} ${uniqueNames[1]}`;
	}

	if (uniqueNames.length === 3) {
		return `${uniqueNames[0]}, ${uniqueNames[1]} ${getLocalizedAnd(locale)} ${uniqueNames[2]}`;
	}

	return `${uniqueNames.slice(0, 3).join(', ')}, e.a.`;
}

export function getIeObjectAvRightsAttributionText(
	ieObject: IeObject,
	locale: Locale,
	usageCategoryLabel?: string | null
): string | null {
	const creatorNames = getAttributionCreatorNames(ieObject);
	const creatorLabel = formatAvRightsAttributionNames(creatorNames, locale);
	const usageCategory =
		usageCategoryLabel ||
		ieObject.rightsInfo?.reuseCategoryLabel ||
		ieObject.rightsInfo?.reuseLabel ||
		getLocalizedMissingRightsInfo(locale);

	return compact([
		creatorLabel,
		ieObject.name,
		ieObject.dateCreated || ieObject.datePublished,
		ieObject.maintainerName,
		usageCategory,
		'hetarchief.be',
	]).join(', ');
}
