import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC } from 'react';

import { type CopyrightConfirmationModalProps } from '@ie-objects/components/CopyrightConfirmationModal/CopyrightConfirmationModal.types';
import { Modal } from '@shared/components/Modal';
import { globalLabelKeys } from '@shared/const';
import { tHtml, tText } from '@shared/helpers/translate';

import styles from './CopyrightConfirmationModal.module.scss';

export const CopyrightConfirmationModal: FC<CopyrightConfirmationModalProps> = (props) => {
	const renderHeading = () => {
		return (
			<h3
				id={globalLabelKeys.modal.title}
				className={clsx(styles['c-copyright-modal__heading'], 'u-text-center')}
			>
				{tText(
					'modules/ie-objects/components/copyright-confirmation-modal/copyright-confirmation-modal___download-deze-krant'
				)}
			</h3>
		);
	};

	return (
		<Modal {...props} heading={renderHeading()}>
			<div
				className={clsx(
					styles['c-copyright-modal__content'],
					'u-text-center',
					'u-pt-24',
					'u-px-24'
				)}
			>
				<div className="u-mb-24 u-mb-40:md u-font-size-14 u-color-neutral">
					{tHtml(
						'modules/ie-objects/components/copyright-confirmation-modal/copyright-confirmation-modal___opgelet-je-gaat-deze-krant-downloaden-ga-zelf-grondig-na-of-er-nog-auteursrechten-rusten-op-dit-object-als-gebruiker-ben-je-zelf-verantwoordelijk'
					)}
				</div>
				<div
					className={clsx(
						styles['c-copyright-modal__content__button-wrapper'],
						'u-mb-40'
					)}
				>
					<Button
						label={tText(
							'modules/ie-objects/components/copyright-confirmation-modal/copyright-confirmation-modal___annuleren'
						)}
						variants="outline"
						onClick={props.onClose}
					/>
					<Button
						label={tText(
							'modules/ie-objects/components/copyright-confirmation-modal/copyright-confirmation-modal___ga-door-met-downloaden'
						)}
						variants="black"
						onClick={props.onConfirm}
					/>
				</div>
			</div>
		</Modal>
	);
};
