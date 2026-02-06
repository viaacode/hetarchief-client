import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterProps } from '@shared/components/Blade/Blade.types';
import { tHtml, tText } from '@shared/helpers/translate';
import React, { type FC } from 'react';

interface MaterialRequestTermAgreementBladeProps {
	isOpen: boolean;
	onClose: (agreed: boolean) => void;
}

const MaterialRequestTermAgreementBlade: FC<MaterialRequestTermAgreementBladeProps> = ({
	isOpen,
	onClose,
}) => {
	const getFooterButtons = (): BladeFooterProps => {
		return [
			{
				label: tText(
					'modules/account/components/material-request-term-agreement-blade/material-request-term-agreement-blade___ik-ga-akkoord'
				),
				mobileLabel: tText('Ik ga akkoord mobiel'),
				type: 'primary',
				onClick: () => onClose(true),
			},
			{
				label: tText(
					'modules/account/components/material-request-term-agreement-blade/material-request-term-agreement-blade___sluit'
				),
				mobileLabel: tText('Sluit mobiel'),
				type: 'secondary',
				onClick: () => onClose(false),
			},
		];
	};

	return (
		<Blade
			id="material-request-term-agreement-blade"
			isOpen={isOpen}
			wideBladeTitle={' '}
			title={tText(
				'modules/account/components/material-request-term-agreement-blade/material-request-term-agreement-blade___aanvullende-gebruiksvoorwaarden-bij-aanvragen'
			)}
			footerButtons={getFooterButtons()}
			onClose={() => onClose(false)}
		>
			{tHtml(
				'modules/account/components/material-request-term-agreement-blade/material-request-term-agreement-blade___aanvullende-gebruiksvoorwaarden-bij-aanvragen-inhoud'
			)}
		</Blade>
	);
};

export default MaterialRequestTermAgreementBlade;
