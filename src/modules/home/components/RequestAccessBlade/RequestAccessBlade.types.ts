import { BladeProps } from '@shared/components';

export interface RequestAccessBladeProps extends Pick<BladeProps, 'isOpen' | 'onClose'> {
	onSubmit?: (values: RequestAccessFormState) => void;
}

export interface RequestAccessFormState {
	requestReason: string;
	visitTime: string;
	acceptTerms: boolean;
}
