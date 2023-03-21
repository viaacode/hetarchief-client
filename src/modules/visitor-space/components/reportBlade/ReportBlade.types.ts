import { FormBladeProps } from '@shared/types';

export type ReportBladeProps = FormBladeProps<ReportFormState> & {
	selected?: ReportSelected;
	email?: string;
};

export interface ReportFormState {
	report: string;
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
