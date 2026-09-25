import type { GroupName } from '@account/const';
import type {
	HetArchiefIeObject,
	HetArchiefIeObjectAccessThrough,
	HetArchiefIeObjectLicense,
} from '@viaa/avo2-types';

/**
 * Response of POST /ie-objects/debug in the hetarchief-proxy
 * (see build-ie-object-access-report.ts and limit-access-to-object-details.types.ts over there)
 */

export enum IeObjectMetadataSet {
	EMPTY = 'EMPTY',
	METADATA_LTD = 'METADATA_LTD',
	METADATA_ALL = 'METADATA_ALL',
	METADATA_ALL_WITH_ESSENCE = 'METADATA_ALL_WITH_ESSENCE',
}

export enum IeObjectAccessGrantedThrough {
	PUBLIC = 'PUBLIC',
	SECTOR = 'SECTOR',
	VISITOR_SPACE = 'VISITOR_SPACE',
}

export enum IeObjectNotVisibleReason {
	NO_LICENSES = 'NO_LICENSES',
	KIOSK_OTHER_MAINTAINER = 'KIOSK_OTHER_MAINTAINER',
	NO_PUBLIC_LICENSE = 'NO_PUBLIC_LICENSE',
	SECTOR_CONDITIONS_NOT_MET = 'SECTOR_CONDITIONS_NOT_MET',
	NO_VISITOR_SPACE_ACCESS = 'NO_VISITOR_SPACE_ACCESS',
	NO_MATCHING_LICENSE = 'NO_MATCHING_LICENSE',
}

export enum IeObjectAccessDebugErrorCode {
	USER_NOT_FOUND = 'USER_NOT_FOUND',
	OBJECT_NOT_FOUND = 'OBJECT_NOT_FOUND',
}

export interface IeObjectAccessDebugViewer {
	source: 'email' | 'session' | 'anonymous';
	fullName: string | null;
	email: string | null;
	groupName: GroupName;
	organisationId: string | null;
	organisationName: string | null;
	sector: string | null;
	isKeyUser: boolean;
	isEvaluator: boolean;
	fullAccessVisitorSpaceIds: string[];
	folderAccessObjectIds: string[];
}

export interface IeObjectAccessTrace {
	userGroupLicenses?: HetArchiefIeObjectLicense[];
	originalObjectLicenses?: HetArchiefIeObjectLicense[];
	impliedObjectLicenses?: HetArchiefIeObjectLicense[];
	isKioskUserOfOtherMaintainer?: boolean;
	publicLicensesGranted?: HetArchiefIeObjectLicense[];
	sectorCheck?: {
		userGroupAllowed: boolean;
		userHasSector: boolean;
		objectHasSector: boolean;
		isKeyUser: boolean;
		objectHasIntraCpLicenses: boolean;
		applies: boolean;
		isOwnMaintainer: boolean;
		licensesBySector: HetArchiefIeObjectLicense[];
		licensesGranted: HetArchiefIeObjectLicense[];
	};
	hasFolderAccess?: boolean;
	hasFullVisitorSpaceAccess?: boolean;
	visitorSpaceLicensesGranted?: HetArchiefIeObjectLicense[];
	userAccessibleLicenses?: HetArchiefIeObjectLicense[];
	accessibleLicenses?: HetArchiefIeObjectLicense[];
	visibleProps?: string[];
	hasAccessToEssence?: boolean;
	accessThrough?: HetArchiefIeObjectAccessThrough[];
}

export interface IeObjectAccessDebugLicense {
	license: HetArchiefIeObjectLicense;
	isImplied: boolean;
	metadataSet: IeObjectMetadataSet;
	grantedThrough: IeObjectAccessGrantedThrough[];
	counts: boolean;
}

export interface IeObjectAccessDebugField {
	field: string;
	requiredMetadataSet: IeObjectMetadataSet | null;
	visible: boolean;
	hasValue: boolean;
}

export type IeObjectAccessDebugIeObject = Partial<HetArchiefIeObject> & { sector?: string };

export interface IeObjectAccessDebugReport {
	ieObject: IeObjectAccessDebugIeObject;
	limitedIeObject: IeObjectAccessDebugIeObject | null;
	isVisible: boolean;
	highestMetadataSet: IeObjectMetadataSet;
	licenses: IeObjectAccessDebugLicense[];
	notVisibleReasons: IeObjectNotVisibleReason[];
	fields: IeObjectAccessDebugField[];
	trace: IeObjectAccessTrace;
	meemooAdminVisitorSpaceFullAdded: boolean;
}

export interface IeObjectAccessDebugResponse {
	viewer: IeObjectAccessDebugViewer | null;
	report: IeObjectAccessDebugReport | null;
	errorCode: IeObjectAccessDebugErrorCode | null;
}

export interface IeObjectAccessDebugRequest {
	schemaIdentifier: string;
	email?: string;
	anonymous?: boolean;
}
