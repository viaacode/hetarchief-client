import { FormBladeProps } from '@shared/types';

export type RequestAccessBladeProps = FormBladeProps<RequestAccessFormState>;

export interface RequestAccessFormState {
	requestReason: string;
	visitTime?: string;
	acceptTerms: boolean;
}
