import { DefaultComponentProps } from '@shared/types';

export interface ToastProps extends DefaultComponentProps {
	title: string;
	description: string;
	buttonLabel: string;
	maxLines: number;
}
