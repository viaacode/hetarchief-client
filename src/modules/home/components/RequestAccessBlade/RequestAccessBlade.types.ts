import type { FormBladeProps } from '@shared/types/blade';

export type RequestAccessBladeProps = FormBladeProps<RequestAccessFormState>;

export interface RequestAccessFormState {
	requestReason: string;
	visitTime?: string;
	acceptTerms: boolean;
}
