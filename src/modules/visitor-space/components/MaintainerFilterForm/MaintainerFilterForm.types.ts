import { type DefaultFilterFormProps } from '../../types';

export type MaintainerFilterFormProps = DefaultFilterFormProps<MaintainerFilterFormState>;

export interface MaintainerFilterFormState {
	maintainers: string[];
}
