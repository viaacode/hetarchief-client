import { Button } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { Blade } from '@shared/components';
import { toastService } from '@shared/services/toast-service';
import { VisitStatus } from '@shared/types';
import { VisitsService } from '@visits/services/visits/visits.service';

import styles from './CancelVisitBlade.module.scss';
import { CancelVisitBladeProps } from './CancelVisitBlade.types';

const CancelVisitBlade: FC<CancelVisitBladeProps> = (props) => {
	const { t } = useTranslation();
	const { selected } = props;

	const onFormSubmit = () => {
		if (!selected) {
			return;
		}

		VisitsService.patchById(selected.id, {
			status: VisitStatus.DENIED,
			note: `[${new Date().toISOString()}] ${t(
				'Deze aanvraag is geannuleerd door de gebruiker'
			)}`,
		}).then(() => {
			toastService.notify({
				title: t('Je aanvraag tot annulatie is verstuurd.'),
				description: t(
					'Je hebt zelf je bezoek geannuleerd, dit wordt ogenblikkelijk verwerkt.'
				),
			});

			props.onFinish?.();
		});
	};

	// Render

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-py-24">
				<Button
					className="u-mb-16"
					label={t('Ja, annuleer bezoek')}
					variants={['block', 'black']}
					onClick={onFormSubmit}
				/>

				<Button label={t('Sluit')} variants={['block', 'text']} onClick={props.onClose} />
			</div>
		);
	};

	return (
		<Blade
			className={styles['c-cancel-visit-blade']}
			{...props}
			footer={renderFooter()}
			title={t('Bezoek annuleren')}
		>
			<div className="u-px-16 u-px-32:md u-pr-56:md">
				<strong>{t('Ben je zeker dat je je bezoek wil annuleren?')}</strong>

				<p>
					{t(
						'Je zal op de ingeplande dag geen toegang hebben tot het materiaal. Een nieuw bezoek inplannen kan steeds.'
					)}
				</p>
			</div>
		</Blade>
	);
};

export default CancelVisitBlade;
