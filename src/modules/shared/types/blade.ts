import { BladeProps } from '@shared/components';

export interface FormBladeProps<T> extends BladeProps {
	onSubmit?: (values: T) => void;
}
