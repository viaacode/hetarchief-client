import { FormControl } from '@meemoo/react-components';
import type { BladeFooterProps } from '@shared/components/Blade/Blade.types';
import { BladeNew } from '@shared/components/Blade/Blade_new';
import { tHtml, tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import { VisitStatus } from '@shared/types/visit-request';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';
import { type FC, useState } from 'react';

import type { CancelVisitBladeProps } from './CancelVisitBlade.types';

const CancelVisitBlade: FC<CancelVisitBladeProps> = (props) => {
	const { selected } = props;
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const onFormSubmit = async () => {
		try {
			setIsSubmitting(true);
			if (!selected) {
				return;
			}

			await VisitRequestService.patchById(selected.id, {
				status: VisitStatus.CANCELLED_BY_VISITOR,
				note: `[${new Date().toISOString()}] ${tHtml(
					'modules/home/components/cancel-visit-blade/cancel-visit-blade___deze-aanvraag-is-geannuleerd-door-de-gebruiker'
				)}`,
			});
			toastService.notify({
				title: tHtml(
					'modules/home/components/cancel-visit-blade/cancel-visit-blade___je-aanvraag-is-geannuleerd'
				),
				description: tHtml(
					'modules/home/components/cancel-visit-blade/cancel-visit-blade___je-hebt-zelf-je-bezoek-geannuleerd-je-zal-geen-toegang-krijgen'
				),
			});

			props.onFinish?.();
		} catch (err) {
			console.error(err);
			toastService.notify({
				title: tHtml('modules/home/components/cancel-visit-blade/cancel-visit-blade___error'),
				description: tHtml(
					'modules/home/components/cancel-visit-blade/cancel-visit-blade___het-annuleren-van-de-aanvraag-is-mislukt'
				),
			});
		}
		setIsSubmitting(false);
	};

	// Render

	const getFooterButtons = (): BladeFooterProps => {
		return [
			{
				label: tText(
					'modules/home/components/cancel-visit-blade/cancel-visit-blade___ja-annuleer-bezoek'
				),
				type: 'primary',
				onClick: onFormSubmit,
				disabled: !props.isOpen || isSubmitting,
			},
			{
				label: tText('modules/home/components/cancel-visit-blade/cancel-visit-blade___sluit'),
				type: 'secondary',
				onClick: props.onClose,
				disabled: !props.isOpen,
			},
		];
	};

	return (
		<BladeNew
			{...props}
			footerButtons={getFooterButtons()}
			title={tText(
				'modules/home/components/cancel-visit-blade/cancel-visit-blade___bezoek-annuleren'
			)}
		>
			<FormControl
				label={tHtml(
					'modules/home/components/cancel-visit-blade/cancel-visit-blade___ben-je-zeker-dat-je-je-bezoek-wil-annuleren'
				)}
			>
				{tHtml(
					'modules/home/components/cancel-visit-blade/cancel-visit-blade___je-zal-op-de-ingeplande-dag-geen-toegang-hebben-tot-het-materiaal-een-nieuw-bezoek-inplannen-kan-steeds'
				)}
			</FormControl>
		</BladeNew>
	);
};

export default CancelVisitBlade;
