import type { ModalProps } from '@shared/components/Modal';

export type CopyrightConfirmationModalProps = Pick<
	ModalProps,
	'className' | 'isOpen' | 'onClose' | 'onOpen'
> & {
	onConfirm: () => void;
};
