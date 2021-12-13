import classnames from 'classnames';
import { FC, useEffect, useState } from 'react';
import Modal from 'react-modal';

import styles from './Modal.module.scss';

export interface MyModalProps {
	isOpen?: boolean;
	className?: string;
	title?: string;
	onClose?: () => void;
	onOpen?: Modal.OnAfterOpenCallback;
}

const MyModal: FC<MyModalProps> = ({ isOpen, className, title, onClose, onOpen, children }) => {
	const [ready, setReady] = useState(false);

	// See https://github.com/reactjs/react-modal#examples
	useEffect(() => {
		const root = document.getElementById('__next') || document.querySelector('body');
		if (root) {
			Modal.setAppElement(root);
			setReady(true);
		}
	}, [setReady]);

	return (
		<Modal
			isOpen={ready && !!isOpen}
			overlayClassName={styles['c-hetarchief-modal__overlay']}
			className={classnames(className, styles['c-hetarchief-modal'])}
			shouldCloseOnEsc={true}
			shouldCloseOnOverlayClick={true}
			onRequestClose={onClose}
			onAfterOpen={onOpen}
		>
			{/* TODO: replace with grid & column components */}
			<section className={styles['c-hetarchief-modal__heading']}>
				<div className={styles['c-hetarchief-modal__title-wrapper']}>
					<h3 className={styles['c-hetarchief-modal__title']}>{title}</h3>
				</div>
				<div className={styles['c-hetarchief-modal__close-wrapper']}>
					{/* TODO: Icon button */}
					<button onClick={onClose} className={styles['c-hetarchief-modal__close']}>
						Close
					</button>
				</div>
			</section>

			<section className={styles['c-hetarchief-modal__content']}>{children}</section>
		</Modal>
	);
};

export default MyModal;
