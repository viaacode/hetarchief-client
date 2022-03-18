import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useState } from 'react';

import { Icon, Modal } from '@shared/components';

import styles from './ObjectPlaceholder.module.scss';
import { ObjectPlaceholderProps } from './ObjectPlaceholder.types';

const ObjectPlaceholder: FC<ObjectPlaceholderProps> = ({
	className,
	description,
	openModalButtonLabel,
	closeModalButtonLabel,
	reasonTitle,
	reasonDescription,
	small = false,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div
			className={clsx(className, styles['c-object-placeholder'], {
				[styles['c-object-placeholder--small']]: small,
			})}
		>
			<div className={styles['c-object-placeholder__page']}>
				<Icon className={styles['c-object-placeholder__icon']} name="hide" />
			</div>
			{description && (
				<p className={styles['c-object-placeholder__description']}>{description}</p>
			)}
			{openModalButtonLabel && (
				<>
					<Button
						label={openModalButtonLabel}
						iconStart={<Icon name="info" />}
						variants={['outline']}
						onClick={() => setIsModalOpen(true)}
					/>

					{(reasonTitle || reasonDescription) && (
						<Modal
							isOpen={isModalOpen}
							title={reasonTitle}
							onClose={() => setIsModalOpen(false)}
						>
							<p className={styles['c-object-placeholder__modal-description']}>
								{reasonDescription}
							</p>
							<div className={styles['c-object-placeholder__modal-button-wrapper']}>
								<Button
									className={styles['c-object-placeholder__modal-button']}
									label={closeModalButtonLabel}
									variants={['black']}
									onClick={() => setIsModalOpen(false)}
								/>
							</div>
						</Modal>
					)}
				</>
			)}
		</div>
	);
};

export default ObjectPlaceholder;
