import { FormBladeProps } from '@shared/types';

import { ProcessRequestBladeProps } from '../ProcessRequestBlade';

export type DeclineRequestBladeProps = FormBladeProps<DeclineRequestFormState> &
	ProcessRequestBladeProps;

export interface DeclineRequestFormState {
	reasonForDenial?: string;
}
