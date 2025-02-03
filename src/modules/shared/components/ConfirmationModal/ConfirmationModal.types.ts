import type { ReactNode } from 'react';

import type { ModalProps } from '../Modal';

export interface ConfirmationModalProps extends Pick<ModalProps, 'isOpen' | 'onClose'> {
	children?: ReactNode;
	text?: ConfirmationModalTranslations;
	onConfirm?: () => void;
	onCancel?: () => void;
}

export interface ConfirmationModalTranslations {
	yes?: string | ReactNode;
	no?: string | ReactNode;
	title?: string | ReactNode;
	description?: ReactNode;
}
