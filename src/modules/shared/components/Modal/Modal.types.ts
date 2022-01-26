import { ReactNode } from 'react';

export interface ModalProps {
	isOpen?: boolean;
	className?: string;
	title?: string;
	heading?: ReactNode;
	footer?: ReactNode;
	onClose?: () => void;
	onOpen?: ReactModal.OnAfterOpenCallback;
}
