import type { IeObject } from '@ie-objects/ie-objects.types';
import { compact, uniq } from 'es-toolkit/compat';

const PRODUCER_ROLE_PARTS = ['producer', 'producent', 'production'];
const BROADCASTER_ROLE_PARTS = ['broadcaster', 'omroep'];

export interface AvRightsAttributionTranslations {
	unknownCreator: string;
	missingRightsInfo: string;
	and: string;
	etAl: string;
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

export function formatAvRightsAttributionNames(
	names: string[],
	translations: AvRightsAttributionTranslations
): string {
	const uniqueNames = uniq(compact(names.map((name) => name.trim())));

	if (uniqueNames.length === 0) {
		return translations.unknownCreator;
	}

	if (uniqueNames.length === 1) {
		return uniqueNames[0];
	}

	if (uniqueNames.length === 2) {
		return `${uniqueNames[0]} ${translations.and} ${uniqueNames[1]}`;
	}

	if (uniqueNames.length === 3) {
		return `${uniqueNames[0]}, ${uniqueNames[1]} ${translations.and} ${uniqueNames[2]}`;
	}

	return `${uniqueNames.slice(0, 3).join(', ')}, ${translations.etAl}`;
}

export function getIeObjectAvRightsAttributionText(
	ieObject: IeObject,
	translations: AvRightsAttributionTranslations,
	usageCategoryLabel?: string | null
): string | null {
	const creatorNames = getAttributionCreatorNames(ieObject);
	const creatorLabel = formatAvRightsAttributionNames(creatorNames, translations);
	const usageCategory =
		usageCategoryLabel ||
		ieObject.rightsInfo?.reuseCategoryLabel ||
		ieObject.rightsInfo?.reuseLabel ||
		translations.missingRightsInfo;

	return compact([
		creatorLabel,
		ieObject.name,
		ieObject.dateCreated || ieObject.datePublished,
		ieObject.maintainerName,
		usageCategory,
		'hetarchief.be',
	]).join(', ');
}
