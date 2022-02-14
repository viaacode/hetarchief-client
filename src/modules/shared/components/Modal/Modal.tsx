import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { default as ReactModal } from 'react-modal';

import { useScrollLock } from '@shared/hooks';

import { Icon } from '../Icon';

import styles from './Modal.module.scss';
import { ModalProps } from './Modal.types';

const Modal: FC<ModalProps> = ({
	children,
	className,
	footer,
	heading,
	isOpen,
	title,
	onClose,
	onOpen,
}) => {
	const [ready, setReady] = useState(false);

	useScrollLock(isOpen ?? false);

	// See https://github.com/reactjs/react-modal#examples
	useEffect(() => {
		const root = document.body;

		if (root) {
			ReactModal.setAppElement(root);
			setReady(true);
		}
	}, []);

	const top = heading || <h3 className={styles['c-hetarchief-modal__title']}>{title}</h3>;

	return (
		<ReactModal
			isOpen={ready && !!isOpen}
			overlayClassName={styles['c-hetarchief-modal__overlay']}
			className={clsx(className, styles['c-hetarchief-modal'])}
			shouldCloseOnEsc={true}
			shouldCloseOnOverlayClick={true}
			onRequestClose={onClose}
			onAfterOpen={onOpen}
		>
			<section className={styles['c-hetarchief-modal__heading']}>
				<div className={styles['c-hetarchief-modal__title-wrapper']}>{top}</div>

				<div className={styles['c-hetarchief-modal__close-wrapper']}>
					<Button
						className={styles['c-hetarchief-modal__close']}
						icon={<Icon name="times" />}
						variants={['text']}
						onClick={onClose}
					/>
				</div>
			</section>

			<section className={styles['c-hetarchief-modal__content']}>{children}</section>
			{footer ? (
				<section className={styles['c-hetarchief-modal__footer']}>{footer}</section>
			) : null}
		</ReactModal>
	);
};

export default Modal;
