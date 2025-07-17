function checkCanExportMetadata(
	isNewsletter: boolean,
	hasLicensePublicDomainOrCopyrightUndetermined: boolean,
	hasLicensePublicContent: boolean,
	hasLicenseVisitorToolMetadataAllOrContent: boolean,
	hasAccessToVisitorSpace: boolean,
	hasPermissionExportObject: boolean
): boolean {
	if (!hasPermissionExportObject) {
		return false;
	}

	if (isNewsletter) {
		return hasLicensePublicDomainOrCopyrightUndetermined && hasLicensePublicContent;
	}
	// audio / video
	return hasLicenseVisitorToolMetadataAllOrContent && hasAccessToVisitorSpace;
}

function checkCanDownloadEssence(
	isNewsletter: boolean,
	hasLicensePublicDomainOrCopyrightUndetermined: boolean,
	hasLicensePublicContent: boolean,
	hasPermissionDownloadObject: boolean
): boolean {
	if (!hasPermissionDownloadObject) {
		return false;
	}
	if (!isNewsletter) {
		// Audio / Videos can never be downloaded in hetarchief v3
		return false;
	}
	// is newspaper
	return hasLicensePublicDomainOrCopyrightUndetermined && hasLicensePublicContent;
}

// https://meemoo.atlassian.net/browse/ARC-3117
// truth table: https://docs.google.com/spreadsheets/d/1HE6W5R1zQSqxa1sgTjbLUC56jpjv3HSbUYqzEu67mC8
export function checkIeObjectPermissions({
	isNewspaper,
	hasLicensePublicDomainOrCopyrightUndetermined,
	hasLicensePublicContent,
	hasLicenseVisitorToolMetadataAllOrContent,
	hasAccessToVisitorSpace,
	hasPermissionExportObject,
	hasPermissionDownloadObject,
}: {
	isNewspaper: boolean;
	hasLicensePublicDomainOrCopyrightUndetermined: boolean;
	hasLicensePublicContent: boolean;
	hasLicenseVisitorToolMetadataAllOrContent: boolean;
	hasAccessToVisitorSpace: boolean;
	hasPermissionExportObject: boolean;
	hasPermissionDownloadObject: boolean;
}): {
	canViewEssence: boolean;
	canExportMetadata: boolean;
	canDownloadEssence: boolean;
} {
	// You can view the essence only if it’s public–content
	const canViewEssence = hasLicensePublicContent;

	// You can export metadata if you have export‐permission AND
	// (it’s public content license OR you’re in the visitor space on a non-newsletter)
	const canExportMetadata = checkCanExportMetadata(
		isNewspaper,
		hasLicensePublicDomainOrCopyrightUndetermined,
		hasLicensePublicContent,
		hasLicenseVisitorToolMetadataAllOrContent,
		hasAccessToVisitorSpace,
		hasPermissionExportObject
	);

	// You can download the essence only on newsletters that carry
	// both public-domain/undetermined & public–content licenses,
	// and if you have download‐permission
	const canDownloadEssence = checkCanDownloadEssence(
		isNewspaper,
		hasLicensePublicDomainOrCopyrightUndetermined,
		hasLicensePublicContent,
		hasPermissionDownloadObject
	);

	return { canViewEssence, canExportMetadata, canDownloadEssence };
}
