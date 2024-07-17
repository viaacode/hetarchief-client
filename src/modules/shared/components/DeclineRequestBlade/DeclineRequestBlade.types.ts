import { type ProcessRequestBladeProps } from '@shared/components/ProcessRequestBlade/ProcessRequestBlade.types';
import { type FormBladeProps } from '@shared/types/blade';

export type DeclineRequestBladeProps = FormBladeProps<DeclineRequestFormState> &
	ProcessRequestBladeProps;

export interface DeclineRequestFormState {
	reasonForDenial?: string;
}
