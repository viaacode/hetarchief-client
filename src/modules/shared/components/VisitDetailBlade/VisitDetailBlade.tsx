import { selectUser } from '@auth/store/user';
import {
	RequestAccessBlade,
	type RequestAccessFormState,
} from '@home/components/RequestAccessBlade';
import { useCreateVisitRequest } from '@home/hooks/create-visit-request';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterProps } from '@shared/components/Blade/Blade.types';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';
import { asDate, formatMediumDateWithTime } from '@shared/utils/dates';
import { useRouter } from 'next/router';
import React, { type FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';

import type { VisitDetailBladeProps } from './VisitDetail.types';
import styles from './VisitDetailBlade.module.scss';

const VisitDetailBlade: FC<VisitDetailBladeProps> = ({ isOpen, onClose, visit }) => {
	const router = useRouter();
	const locale = useLocale();
	const [isRequestAccessBladeOpen, setIsRequestAccessBladeOpen] = useState(false);

	const { mutateAsync: createVisitRequest } = useCreateVisitRequest();

	const [, setQuery] = useQueryParams({
		[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
	});
	const user = useSelector(selectUser);

	const onCloseVisitDetailBlade = () => {
		!isRequestAccessBladeOpen && onClose();
	};

	const onRequestAccessSubmit = async (values: RequestAccessFormState) => {
		try {
			if (!user || !visit.spaceSlug) {
				toastService.notify({
					title: tText(
						'modules/shared/components/visit-detail-blade/visit-detail-blade___je-bent-niet-ingelogd'
					),
					description: tText(
						'modules/shared/components/visit-detail-blade/visit-detail-blade___je-bent-niet-ingelogd-log-opnieuw-in-en-probeer-opnieuw'
					),
				});
				return;
			}

			const createdVisitRequest = await createVisitRequest({
				acceptedTos: values.acceptTerms,
				reason: values.requestReason,
				visitorSpaceSlug: visit.spaceSlug as string,
				timeframe: values.visitTime,
			});

			setIsRequestAccessBladeOpen(false);
			await router.push(
				ROUTES_BY_LOCALE[locale].visitRequested.replace(':slug', createdVisitRequest.spaceSlug)
			);
		} catch (err) {
			console.error({
				message: 'Failed to create visit request',
				error: err,
				info: values,
			});
			toastService.notify({
				title: tText(
					'modules/shared/components/visit-detail-blade/visit-detail-blade___er-ging-iets-mis'
				),
				description: tText(
					'modules/shared/components/visit-detail-blade/visit-detail-blade___er-ging-iets-mis-beschrijving'
				),
			});
		}
	};

	const onOpenRequestAccess = () => {
		setQuery({
			[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: visit.spaceSlug,
		});
		setIsRequestAccessBladeOpen(true);
	};

	const getFooterButtons = (): BladeFooterProps => {
		return [
			{
				label: tText(
					'modules/shared/components/visit-detail-blade/visit-detail-blade___plan-bezoek'
				),
				type: 'primary',
				onClick: () => onOpenRequestAccess(),
			},
			{
				label: tText('modules/shared/components/visit-detail-blade/visit-detail-blade___sluit'),
				type: 'secondary',
				onClick: onCloseVisitDetailBlade,
			},
		];
	};

	return (
		<Blade
			isOpen={isOpen}
			title={tText(
				'modules/shared/components/visit-detail-blade/visit-detail-blade___bezoekdetail'
			)}
			footerButtons={getFooterButtons()}
			onClose={onCloseVisitDetailBlade}
			id="visit-detail-blade"
		>
			<div className={styles['c-visit-detail-blade']}>
				<strong>
					{tHtml('modules/shared/components/visit-detail-blade/visit-detail-blade___toegang-van')}
				</strong>
				<p>{formatMediumDateWithTime(asDate(visit.startAt))}</p>

				<strong>
					{tHtml('modules/shared/components/visit-detail-blade/visit-detail-blade___toegang-tot')}
				</strong>
				<p>{formatMediumDateWithTime(asDate(visit.endAt))}</p>
			</div>
			<RequestAccessBlade
				isOpen={isRequestAccessBladeOpen}
				onClose={() => {
					setIsRequestAccessBladeOpen(false);
				}}
				onSubmit={onRequestAccessSubmit}
				id="visit-detail-blade__request-access-blade"
			/>
		</Blade>
	);
};

export default VisitDetailBlade;
