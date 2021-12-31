import { DefaultComponentProps } from '@shared/types';

export interface ToastProps extends DefaultComponentProps {
	title: string;
	description: string;
	buttonLabel: string;
	buttonLabelHover?: string;
	maxLines?: number;
	visible?: boolean;
	onClose: () => void;
}
