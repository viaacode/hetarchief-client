import { Button } from '@meemoo/react-components';
import { FC, useState } from 'react';

import { Blade } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { VisitStatus } from '@shared/types';
import { VisitsService } from '@visits/services/visits/visits.service';

import styles from './CancelVisitBlade.module.scss';
import { CancelVisitBladeProps } from './CancelVisitBlade.types';

const CancelVisitBlade: FC<CancelVisitBladeProps> = (props) => {
	const { t } = useTranslation();
	const { selected } = props;
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const onFormSubmit = async () => {
		try {
			setIsSubmitting(true);
			if (!selected) {
				return;
			}

			await VisitsService.patchById(selected.id, {
				status: VisitStatus.CANCELLED_BY_VISITOR,
				note: `[${new Date().toISOString()}] ${t(
					'modules/home/components/cancel-visit-blade/cancel-visit-blade___deze-aanvraag-is-geannuleerd-door-de-gebruiker'
				)}`,
			});
			toastService.notify({
				title: t(
					'modules/home/components/cancel-visit-blade/cancel-visit-blade___je-aanvraag-is-geannuleerd'
				),
				description: t(
					'modules/home/components/cancel-visit-blade/cancel-visit-blade___je-hebt-zelf-je-bezoek-geannuleerd-je-zal-geen-toegang-krijgen'
				),
			});

			props.onFinish?.();
		} catch (err) {
			console.error(err);
			toastService.notify({
				title: t('modules/home/components/cancel-visit-blade/cancel-visit-blade___error'),
				description: t(
					'modules/home/components/cancel-visit-blade/cancel-visit-blade___het-annuleren-van-de-aanvraag-is-mislukt'
				),
			});
		}
		setIsSubmitting(false);
	};

	// Render

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-py-24">
				<Button
					className="u-mb-16"
					label={t(
						'modules/home/components/cancel-visit-blade/cancel-visit-blade___ja-annuleer-bezoek'
					)}
					variants={['block', 'black']}
					onClick={onFormSubmit}
					disabled={!props.isOpen || isSubmitting}
				/>

				<Button
					label={t(
						'modules/home/components/cancel-visit-blade/cancel-visit-blade___sluit'
					)}
					variants={['block', 'text']}
					onClick={props.onClose}
					disabled={!props.isOpen}
				/>
			</div>
		);
	};

	return (
		<Blade
			className={styles['c-cancel-visit-blade']}
			{...props}
			footer={renderFooter()}
			title={t(
				'modules/home/components/cancel-visit-blade/cancel-visit-blade___bezoek-annuleren'
			)}
		>
			<div className="u-px-16 u-px-32:md u-pr-56:md">
				<strong>
					{t(
						'modules/home/components/cancel-visit-blade/cancel-visit-blade___ben-je-zeker-dat-je-je-bezoek-wil-annuleren'
					)}
				</strong>

				<p>
					{t(
						'modules/home/components/cancel-visit-blade/cancel-visit-blade___je-zal-op-de-ingeplande-dag-geen-toegang-hebben-tot-het-materiaal-een-nieuw-bezoek-inplannen-kan-steeds'
					)}
				</p>
			</div>
		</Blade>
	);
};

export default CancelVisitBlade;
