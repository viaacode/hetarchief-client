import { Button } from '@meemoo/react-components';
import type { FC } from 'react';

import { tHtml } from '@shared/helpers/translate';

import { Modal } from '../Modal';

import type { ConfirmationModalProps } from './ConfirmationModal.types';

const ConfirmationModal: FC<ConfirmationModalProps> = ({
	text = {},
	onConfirm,
	onCancel,
	onClose,
	isOpen,
}) => {
	const { title, description, yes, no } = text;

	const renderButtons = () => {
		return (
			<div className="u-text-center u-mb-48">
				<Button
					label={
						no || tHtml('modules/shared/components/confirmation-modal/confirmation-modal___nee')
					}
					className="u-mx-4"
					name={'cancel'}
					onClick={onCancel}
					variants={['white']}
				/>
				<Button
					label={
						yes || tHtml('modules/shared/components/confirmation-modal/confirmation-modal___ja')
					}
					className="u-mx-4"
					name={'confirm'}
					onClick={onConfirm}
					variants={['black']}
				/>
			</div>
		);
	};

	return (
		<Modal
			className="c-confirmation-modal"
			onClose={onClose}
			isOpen={isOpen}
			title={
				title ||
				tHtml('modules/shared/components/confirmation-modal/confirmation-modal___ben-je-zeker')
			}
			footer={renderButtons()}
		>
			{description || (
				<p className="u-px-24 u-mb-32 u-color-neutral u-text-center">
					{tHtml(
						'modules/shared/components/confirmation-modal/confirmation-modal___deze-actie-kan-niet-worden-teruggedraaid'
					)}
				</p>
			)}
		</Modal>
	);
};

export default ConfirmationModal;
