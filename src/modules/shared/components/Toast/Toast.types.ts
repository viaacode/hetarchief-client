import type { ReactNode } from 'react';

import type { DefaultComponentProps } from '@shared/types';

export interface ToastProps extends DefaultComponentProps {
	children?: ReactNode;
	title: string | ReactNode;
	description: string | ReactNode;
	buttonLabel: string;
	buttonLabelHover?: string;
	maxLines?: number;
	visible?: boolean;
	onClose: () => void;
}
