import clsx from 'clsx';
import { FC, ReactNode, useEffect, useState } from 'react';
import Modal from 'react-modal';

import styles from './Modal.module.scss';

export interface MyModalProps {
	isOpen?: boolean;
	className?: string;
	title?: string;
	heading?: JSX.Element;
	footer?: JSX.Element;
	onClose?: () => void;
	onOpen?: Modal.OnAfterOpenCallback;
}

const MyModal: FC<MyModalProps> = ({
	isOpen,
	className,
	title,
	heading,
	footer,
	onClose,
	onOpen,
	children,
}) => {
	const [ready, setReady] = useState(false);

	// See https://github.com/reactjs/react-modal#examples
	useEffect(() => {
		const root = document.getElementById('__next') || document.querySelector('body');
		if (root) {
			Modal.setAppElement(root);
			setReady(true);
		}
	}, [setReady]);

	const top: JSX.Element = heading || (
		<h3 className={styles['c-hetarchief-modal__title']}>{title}</h3>
	);

	const middle: ReactNode = children;

	const bottom: JSX.Element | undefined = footer || <></>;

	return (
		<Modal
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
					{/* TODO: Add accessible icon button, ARC-178 / ARC-177 */}
					<button onClick={onClose} className={styles['c-hetarchief-modal__close']}>
						Close
					</button>
				</div>
			</section>

			<section className={styles['c-hetarchief-modal__content']}>{middle}</section>
			<section className={styles['c-hetarchief-modal__footer']}>{bottom}</section>
		</Modal>
	);
};

export default MyModal;
