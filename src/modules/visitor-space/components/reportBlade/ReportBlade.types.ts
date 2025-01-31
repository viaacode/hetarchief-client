import type { User } from '@auth/types';
import type { FormBladeProps } from '@shared/types/blade';

export type ReportBladeProps = FormBladeProps<ReportFormState> & {
	selected?: ReportSelected;
	user?: User | null;
};

export interface ReportFormState {
	reportMessage: string;
	email: string;
}

export interface ReportSelected {
	schemaIdentifier: string;
	title?: string; // string-only, not ReactNode
}

export interface ReportFormStatePair {
	folder: string;
	ie: string;
	checked?: boolean;
}
