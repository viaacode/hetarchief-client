import type { User } from '@auth/types';
import { ReportLegalReason, ReportReason } from '@shared/services/zendesk-service';
import type { FormBladeProps } from '@shared/types/blade';
import type { HetArchiefIeObject } from '@viaa/avo2-types';

// Re-exported so the rest of the reportBlade module can import them from one place.
export { ReportLegalReason, ReportReason };
export type { IeObjectSupportPayload } from '@shared/services/zendesk-service';

export type ReportBladeProps = FormBladeProps<ReportFormState> & {
	mediaInfo?: HetArchiefIeObject | null;
	user?: User | null;
};

export interface ReportFormState {
	generalQuestionMessage: string;
	metadataIssueMessage: string;
	email: string;
	selectedReportReason: ReportReason | null;
	legalReason: ReportLegalReason | null;
	legalRemarkText: string;
}

export interface ReportRootOption {
	label: string;
	value: ReportReason;
}

export interface ReportLegalReasonOption {
	label: string;
	value: ReportLegalReason;
}
