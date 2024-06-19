import { type ReactNode } from 'react';
import { type OnAfterOpenCallback } from 'react-modal';

export interface ModalProps {
	children?: ReactNode;
	isOpen?: boolean;
	className?: string;
	title?: string | ReactNode;
	heading?: ReactNode;
	footer?: ReactNode;
	onClose?: () => void;
	onOpen?: OnAfterOpenCallback;
	excludeScrollbar?: boolean;
}
