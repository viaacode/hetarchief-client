import type { Locale } from '@shared/utils/i18n';

/**
 * Kept in sync by hand with `ReportReason` in
 * hetarchief-proxy/src/modules/zendesk/zendesk.types.ts
 */
export enum ReportReason {
	METADATA_ISSUE = 'METADATA_ISSUE',
	GENERAL_QUESTION = 'GENERAL_QUESTION',
	LEGAL_REMARK = 'LEGAL_REMARK',
}

/**
 * Kept in sync by hand with `ReportLegalReason` in
 * hetarchief-proxy/src/modules/zendesk/zendesk.types.ts
 */
export enum ReportLegalReason {
	OPT_OUT_OR_REMOVAL = 'OPT_OUT_OR_REMOVAL',
	IP_COMPLAINT = 'IP_COMPLAINT',
	GDPR_PRIVACY = 'GDPR_PRIVACY',
}

/**
 * Payload sent to `POST /zendesk/ie-object-support`.
 * Kept in sync by hand with `CreateIeObjectSupportRequestDto` in
 * hetarchief-proxy/src/modules/zendesk/dto/zendesk.dto.ts
 */
export interface IeObjectSupportPayload {
	reportReason: ReportReason;
	reportLegalReason?: ReportLegalReason;
	locale: Locale;
	message: string;
	url: string;
	email?: string;
	name?: string;
	maintainerId?: string;
	mamUrl?: string;
	aiMeemooUrl?: string;
}
