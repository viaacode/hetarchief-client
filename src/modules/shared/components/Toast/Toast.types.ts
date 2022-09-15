import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface ToastProps extends DefaultComponentProps {
	title: string | ReactNode;
	description: string | ReactNode;
	buttonLabel: string;
	buttonLabelHover?: string;
	maxLines?: number;
	visible?: boolean;
	onClose: () => void;
}
