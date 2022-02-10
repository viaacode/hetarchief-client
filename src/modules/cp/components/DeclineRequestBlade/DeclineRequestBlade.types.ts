import { FormBladeProps } from '@shared/types';

export type DeclineRequestBladeProps = FormBladeProps<DeclineRequestFormState>;

export interface DeclineRequestFormState {
	reasonForDenial?: string;
}
