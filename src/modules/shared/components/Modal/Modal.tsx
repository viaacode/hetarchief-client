import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useEffect, useState } from 'react';
import { default as ReactModal } from 'react-modal';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { globalLabelKeys } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { useScrollLock } from '@shared/hooks/use-scroll-lock';
import { useScrollbarWidth } from '@shared/hooks/use-scrollbar-width';

import styles from './Modal.module.scss';
import type { ModalProps } from './Modal.types';

const Modal: FC<ModalProps> = ({
	children,
	className,
	footer,
	heading,
	isOpen,
	title,
	onClose,
	onOpen,
	excludeScrollbar = true,
}) => {
	const [ready, setReady] = useState(false);
	const scrollbarWidth = useScrollbarWidth(!!isOpen);

	useScrollLock(isOpen ?? false, 'Modal');

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
			overlayElement={(props, contentElement) => (
				<div
					{...props}
					className={styles['c-hetarchief-modal__overlay']}
					style={{
						width: excludeScrollbar ? `calc(100vw - ${scrollbarWidth}px)` : '100vw',
					}}
				>
					{contentElement}
				</div>
			)}
			onAfterOpen={onOpen}
			aria={{
				labelledby: globalLabelKeys.modal.title,
			}}
		>
			<section className={styles['c-hetarchief-modal__heading']}>
				<div className={styles['c-hetarchief-modal__title-wrapper']}>{top}</div>

				<div className={styles['c-hetarchief-modal__close-wrapper']}>
					<Button
						className={styles['c-hetarchief-modal__close']}
						icon={<Icon name={IconNamesLight.Times} aria-hidden />}
						aria-label={tText('modules/shared/components/modal/modal___sluiten')}
						variants={['text']}
						onClick={onClose}
					/>
				</div>
			</section>

			<section className={styles['c-hetarchief-modal__content']}>{children}</section>

			{footer && <section className={styles['c-hetarchief-modal__footer']}>{footer}</section>}
		</ReactModal>
	);
};

export default Modal;
