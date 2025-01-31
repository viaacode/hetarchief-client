import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useState } from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Modal } from '@shared/components/Modal';
import { tText } from '@shared/helpers/translate';

import styles from './ObjectPlaceholder.module.scss';
import type { ObjectPlaceholderProps } from './ObjectPlaceholder.types';

const ObjectPlaceholder: FC<ObjectPlaceholderProps> = ({
	className,
	description,
	openModalButtonLabel,
	closeModalButtonLabel,
	reasonTitle,
	reasonDescription,
	small = false,
	onOpenRequestAccess,
	addSliderPadding = false,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div
			className={clsx(className, styles['c-object-placeholder'], {
				[styles['c-object-placeholder--small']]: small,
				[styles['c-object-placeholder--with-slider']]: addSliderPadding,
			})}
		>
			<div className={styles['c-object-placeholder__page']}>
				<Icon className={styles['c-object-placeholder__icon']} name={IconNamesLight.Hide} />
			</div>
			{description && <p className={styles['c-object-placeholder__description']}>{description}</p>}
			{openModalButtonLabel && (
				<>
					<Button
						label={openModalButtonLabel}
						iconStart={<Icon name={IconNamesLight.Info} />}
						variants={['outline']}
						onClick={() => setIsModalOpen(true)}
					/>
					{onOpenRequestAccess && (
						<Button
							label={tText(
								'modules/ie-objects/components/object-placeholder/object-placeholder___plan-een-bezoek'
							)}
							variants={['dark']}
							className={styles['c-object-placeholder__visit-button']}
							onClick={() => onOpenRequestAccess()}
						/>
					)}

					{(reasonTitle || reasonDescription) && (
						<Modal isOpen={isModalOpen} title={reasonTitle} onClose={() => setIsModalOpen(false)}>
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
