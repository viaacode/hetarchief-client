import { ReactNode } from 'react';

import { ModalProps } from '../Modal';

export interface ConfirmationModalProps extends Pick<ModalProps, 'isOpen' | 'onClose'> {
	title?: string;
	description?: ReactNode;
	onConfirm?: () => void;
	onCancel?: () => void;
}
