import { ReactNode } from 'react';
import { OnAfterOpenCallback } from 'react-modal';

export interface ModalProps {
	children?: React.ReactNode;
	isOpen?: boolean;
	className?: string;
	title?: string | ReactNode;
	heading?: ReactNode;
	footer?: ReactNode;
	onClose?: () => void;
	onOpen?: OnAfterOpenCallback;
	excludeScrollbar?: boolean;
}
