// check-ie-object-permissions.test.ts

import { checkIeObjectPermissions } from './check-ie-object-permissions';

// https://meemoo.atlassian.net/browse/ARC-3117
// https://docs.google.com/spreadsheets/d/1dhUZ37GGKJjCfw2qplwrVf6YFB6YUTuMANuVjHgSJY4/edit?gid=0#gid=0
describe('checkIeObjectPermissions (hard-coded 64 cases)', () => {
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: true
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: true,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: true,
		canDownloadEssence: true
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: true,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: true
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: true,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: true,
		canDownloadEssence: true
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: true,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: false,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: false,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: false,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: false,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: false,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: false,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: false,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: false,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: true
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: true,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: false,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: true,
		canDownloadEssence: true
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: false,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: true,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: false
	} => {
		canViewEssence: true,
		canExportMetadata: true,
		canDownloadEssence: false
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: false,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: false,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: false,
		canDownloadEssence: true
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: false,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: true,
		});
	});
	test(`{
		isNewsletter: true,
		hasLicensePublicDomainOrCopyrightUndetermined: true,
		hasLicensePublicContent: true,
		hasLicenseVisitorToolMetadataAllOrContent: false,
		hasAccessToVisitorSpace: true,
		hasPermissionExportObject: true,
		hasPermissionDownloadObject: true
	} => {
		canViewEssence: true,
		canExportMetadata: true,
		canDownloadEssence: true
	}`, () => {
		const result = checkIeObjectPermissions({
			isNewspaper: true,
			hasLicensePublicDomainOrCopyrightUndetermined: true,
			hasLicensePublicContent: true,
			hasLicenseVisitorToolMetadataAllOrContent: false,
			hasAccessToVisitorSpace: true,
			hasPermissionExportObject: true,
			hasPermissionDownloadObject: true,
			isLoggedOutUser: false,
		});
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: true,
		});
	});
});
