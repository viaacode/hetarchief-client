import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface ToastProps extends DefaultComponentProps {
	children?: ReactNode;
	title: string | ReactNode;
	description: string | ReactNode;
	buttonLabel: string;
	buttonLabelHover?: string;
	maxLines?: number;
	visible?: boolean;
	onClose: () => void;
	actionLabel?: string;
	onAction?: () => void;
}
