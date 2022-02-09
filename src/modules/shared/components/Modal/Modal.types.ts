import { ReactNode } from 'react';
import { OnAfterOpenCallback } from 'react-modal';

export interface ModalProps {
	isOpen?: boolean;
	className?: string;
	title?: string;
	heading?: ReactNode;
	footer?: ReactNode;
	onClose?: () => void;
	onOpen?: OnAfterOpenCallback;
}
