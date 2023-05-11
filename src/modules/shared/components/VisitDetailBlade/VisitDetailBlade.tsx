import { Button } from '@meemoo/react-components';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';

import { selectUser } from '@auth/store/user';
import { RequestAccessBlade, RequestAccessFormState } from '@home/components';
import { useCreateVisitRequest } from '@home/hooks/create-visit-request';
import { Blade } from '@shared/components';
import { ROUTES } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { asDate, formatMediumDateWithTime } from '@shared/utils';

import { VisitDetailBladeProps } from './VisitDetail.types';
import styles from './VisitDetailBlade.module.scss';

const VisitDetailBlade: FC<VisitDetailBladeProps> = ({ isOpen, onClose, visit }) => {
	const { tText } = useTranslation();
	const router = useRouter();
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
				ROUTES.visitRequested.replace(':slug', createdVisitRequest.spaceSlug)
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
		setQuery({ [QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: visit.spaceSlug });
		setIsRequestAccessBladeOpen(true);
	};

	const renderFooter = () => {
		return (
			<div className={styles['c-visit-detail-blade__close-button-container']}>
				<Button
					label={tText(
						'modules/shared/components/visit-detail-blade/visit-detail-blade___plan-bezoek'
					)}
					variants={['block', 'text', 'dark']}
					className={styles['c-visit-detail-blade__plan-button']}
					onClick={() => onOpenRequestAccess()}
				/>
				<Button
					label={tText(
						'modules/shared/components/visit-detail-blade/visit-detail-blade___sluit'
					)}
					variants={['block', 'text', 'light']}
					onClick={onCloseVisitDetailBlade}
				/>
			</div>
		);
	};

	return (
		<Blade
			isOpen={isOpen}
			renderTitle={() => (
				<h4 className={styles['c-visit-detail-blade__title']}>
					{tText(
						'modules/shared/components/visit-detail-blade/visit-detail-blade___bezoekdetail'
					)}
				</h4>
			)}
			footer={isOpen && renderFooter()}
			onClose={onCloseVisitDetailBlade}
		>
			<div className={styles['c-visit-detail-blade__content']}>
				<div className={styles['c-visit-detail-blade__content-element']}>
					<span className={styles['c-visit-detail-blade__content-element-label']}>
						{tText(
							'modules/shared/components/visit-detail-blade/visit-detail-blade___toegang-van'
						)}
					</span>
					<span className={styles['c-visit-detail-blade__content-element-value']}>
						{formatMediumDateWithTime(asDate(visit.startAt))}
					</span>
				</div>
				<div className={styles['c-visit-detail-blade__content-element']}>
					<span className={styles['c-visit-detail-blade__content-element-label']}>
						{tText(
							'modules/shared/components/visit-detail-blade/visit-detail-blade___toegang-tot'
						)}
					</span>
					<span className={styles['c-visit-detail-blade__content-element-value']}>
						{formatMediumDateWithTime(asDate(visit.endAt))}
					</span>
				</div>
			</div>
			<RequestAccessBlade
				isOpen={isRequestAccessBladeOpen}
				onClose={() => {
					setIsRequestAccessBladeOpen(false);
				}}
				onSubmit={onRequestAccessSubmit}
			/>
		</Blade>
	);
};

export default VisitDetailBlade;
