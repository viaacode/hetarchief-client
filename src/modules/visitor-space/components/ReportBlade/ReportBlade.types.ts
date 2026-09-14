import type { User } from '@auth/types';
import type { BladeProps } from '@shared/components/Blade/Blade.types';
import { ReportLegalReason, ReportReason } from '@shared/services/zendesk-service';
import type { HetArchiefIeObject } from '@viaa/avo2-types';

// Re-exported so the rest of the reportBlade module can import them from one place.
export { ReportLegalReason, ReportReason };
export type { IeObjectSupportPayload } from '@shared/services/zendesk-service';

export type ReportBladeProps = Omit<BladeProps, 'title' | 'footerButtons'> & {
	mediaInfo?: HetArchiefIeObject | null;
	user?: User | null;
};

export interface ReportRootOption {
	label: string;
	value: ReportReason;
}

export interface ReportLegalReasonOption {
	label: string;
	value: ReportLegalReason;
}
