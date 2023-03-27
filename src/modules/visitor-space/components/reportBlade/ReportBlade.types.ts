import { User } from '@auth/types';
import { FormBladeProps } from '@shared/types';

export type ReportBladeProps = FormBladeProps<ReportFormState> & {
	selected?: ReportSelected;
	user?: User | null;
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
