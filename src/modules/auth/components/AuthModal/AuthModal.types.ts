import { type ModalProps } from '@shared/components/Modal';

export type AuthModalProps = Pick<ModalProps, 'className' | 'isOpen' | 'onClose' | 'onOpen'>;
