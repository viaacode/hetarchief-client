import { Button } from '@meemoo/react-components';
import { type FC, useState } from 'react';

import { Blade } from '@shared/components/Blade/Blade';
import { tHtml } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import { VisitStatus } from '@shared/types/visit-request';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';

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

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-px-16-md u-py-24">
				<Button
					className="u-mb-16"
					label={tHtml(
						'modules/home/components/cancel-visit-blade/cancel-visit-blade___ja-annuleer-bezoek'
					)}
					variants={['block', 'black']}
					onClick={onFormSubmit}
					disabled={!props.isOpen || isSubmitting}
				/>

				<Button
					label={tHtml('modules/home/components/cancel-visit-blade/cancel-visit-blade___sluit')}
					variants={['block', 'text']}
					onClick={props.onClose}
					disabled={!props.isOpen}
				/>
			</div>
		);
	};

	return (
		<Blade
			{...props}
			footer={renderFooter()}
			renderTitle={(props: Pick<HTMLElement, 'id' | 'className'>) => (
				<h2 {...props}>
					{tHtml(
						'modules/home/components/cancel-visit-blade/cancel-visit-blade___bezoek-annuleren'
					)}
				</h2>
			)}
		>
			<div className="u-px-32 u-px-16-md u-pr-56">
				<strong>
					{tHtml(
						'modules/home/components/cancel-visit-blade/cancel-visit-blade___ben-je-zeker-dat-je-je-bezoek-wil-annuleren'
					)}
				</strong>

				<p>
					{tHtml(
						'modules/home/components/cancel-visit-blade/cancel-visit-blade___je-zal-op-de-ingeplande-dag-geen-toegang-hebben-tot-het-materiaal-een-nieuw-bezoek-inplannen-kan-steeds'
					)}
				</p>
			</div>
		</Blade>
	);
};

export default CancelVisitBlade;
