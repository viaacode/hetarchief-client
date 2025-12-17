import { Button } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import { tHtml, tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import React, { type FC } from 'react';

import styles from './MaterialRequestTermAgreementBlade.module.scss';

interface MaterialRequestTermAgreementBladeProps {
	isOpen: boolean;
	onClose: (agreed: boolean) => void;
}

const MaterialRequestTermAgreementBlade: FC<MaterialRequestTermAgreementBladeProps> = ({
	isOpen,
	onClose,
}) => {
	const renderTitle = (props: Pick<HTMLElement, 'id' | 'className'>) => {
		return (
			<h2
				{...props}
				className={clsx(props.className, styles['c-material-request-term-agreement-blade__title'])}
			>
				{tText('Aanvullende gebruiksvoorwaarden bij aanvragen')}
			</h2>
		);
	};

	const renderFooter = () => {
		return (
			<div className={styles['c-material-request-term-agreement-blade__footer-container']}>
				<Button
					label={tText('Sluit')}
					variants={['text', 'light']}
					onClick={() => onClose(false)}
					className={styles['c-material-request-term-agreement-blade__cancel-button']}
				/>
				<Button
					label={tText('Ik ga akkoord')}
					variants={['text', 'dark']}
					onClick={() => onClose(true)}
					className={styles['c-material-request-term-agreement-blade__agree-button']}
				/>
			</div>
		);
	};

	return (
		<Blade
			isOpen={isOpen}
			extraWide
			renderTitle={renderTitle}
			footer={renderFooter()}
			onClose={() => onClose(false)}
			id="material-request-term-agreement-blade"
		>
			{isOpen && (
				<div className={styles['c-material-request-term-agreement-blade__content-container']}>
					<div className={styles['c-material-request-term-agreement-blade__content-form']}>
						{tHtml('Aanvullende gebruiksvoorwaarden bij aanvragen inhoud')}
					</div>
				</div>
			)}
		</Blade>
	);
};

export default MaterialRequestTermAgreementBlade;
