import type { BladeFooterProps } from '@shared/components/Blade/Blade.types';
import { BladeNew } from '@shared/components/Blade/Blade_new';
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
				type: 'primary',
				onClick: () => onClose(true),
			},
			{
				label: tText(
					'modules/account/components/material-request-term-agreement-blade/material-request-term-agreement-blade___sluit'
				),
				type: 'secondary',
				onClick: () => onClose(false),
			},
		];
	};

	return (
		<BladeNew
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
		</BladeNew>
	);
};

export default MaterialRequestTermAgreementBlade;
