import { ReactNode } from 'react';

import { ModalProps } from '../Modal';

export interface ConfirmationModalProps extends Pick<ModalProps, 'isOpen' | 'onClose'> {
	text?: ConfirmationModalTranslations;
	onConfirm?: () => void;
	onCancel?: () => void;
}

export interface ConfirmationModalTranslations {
	yes?: string;
	no?: string;
	title?: string;
	description?: ReactNode;
}
