import { Button } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { Modal } from '../Modal';

import { ConfirmationModalProps } from './ConfirmationModal.types';

const ConfirmationModal: FC<ConfirmationModalProps> = ({
	title,
	description,
	onConfirm,
	onCancel,
	onClose,
	isOpen,
}) => {
	const [t] = useTranslation();

	const renderButtons = () => {
		return (
			<div className="u-text-center u-mb-48">
				<Button
					label={t(
						'modules/shared/components/confirmation-modal/confirmation-modal___ja'
					)}
					name={'Ja'}
					onClick={onConfirm}
					variants={['black']}
				/>
				<Button
					label={t(
						'modules/shared/components/confirmation-modal/confirmation-modal___nee'
					)}
					className="u-ml-8"
					name={'Ja'}
					onClick={onCancel}
					variants={['white']}
				/>
			</div>
		);
	};

	return (
		<Modal
			onClose={onClose}
			isOpen={isOpen}
			title={
				title ||
				t('modules/shared/components/confirmation-modal/confirmation-modal___ben-je-zeker')
			}
			footer={renderButtons()}
		>
			{description || (
				<p className="u-px-24 u-mb-32 u-color-neutral u-text-center">
					{t(
						'modules/shared/components/confirmation-modal/confirmation-modal___deze-actie-kan-niet-worden-teruggedraaid'
					)}
				</p>
			)}
		</Modal>
	);
};

export default ConfirmationModal;
