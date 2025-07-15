// https://meemoo.atlassian.net/browse/ARC-3117
// truth table: https://docs.google.com/spreadsheets/d/1HE6W5R1zQSqxa1sgTjbLUC56jpjv3HSbUYqzEu67mC8
export function checkIeObjectPermissions(
	isNewsletter: boolean,
	hasLicensePublicDomainOrCopyrightUndetermined: boolean,
	hasLicensePublicContent: boolean,
	hasAccessToVisitorSpace: boolean,
	hasPermissionExportObject: boolean,
	hasPermissionDownloadObject: boolean
): {
	canViewEssence: boolean;
	canExportMetadata: boolean;
	canDownloadEssence: boolean;
} {
	// You can view the essence only if it’s public–content
	const canViewEssence = hasLicensePublicContent;

	// You can export metadata if you have export‐permission AND
	// (it’s public content license OR you’re in the visitor space on a non-newsletter)
	const canExportMetadata =
		hasPermissionExportObject &&
		(hasLicensePublicContent || (hasAccessToVisitorSpace && !isNewsletter));

	// You can download the essence only on newsletters that carry
	// both public-domain/undetermined & public–content licenses,
	// and if you have download‐permission
	const canDownloadEssence =
		isNewsletter &&
		hasLicensePublicDomainOrCopyrightUndetermined &&
		hasLicensePublicContent &&
		hasPermissionDownloadObject;

	return { canViewEssence, canExportMetadata, canDownloadEssence };
}
