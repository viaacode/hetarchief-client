import { BladeProps } from '@shared/components';

export interface FormBladeProps<T> extends BladeProps {
	children?: React.ReactNode;
	onSubmit?: (values: T) => Promise<void>;
}
