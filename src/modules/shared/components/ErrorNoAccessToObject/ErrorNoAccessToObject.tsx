import { Button } from '@meemoo/react-components';
import { useRouter } from 'next/router';
import { FC, ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';

import { selectUser } from '@auth/store/user';
import { RequestAccessBlade, RequestAccessFormState } from '@home/components';
import { VISITOR_SPACE_SLUG_QUERY_KEY } from '@home/const';
import { useCreateVisitRequest } from '@home/hooks/create-visit-request';
import { ErrorPage } from '@shared/components';
import { ROUTES } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';

import styles from './ErrorNoAccessToObject.module.scss';

interface ErrorNoAccessToObjectProps {
	visitorSpaceName: string | null;
	visitorSpaceSlug: string | null;
	description: string | ReactNode;
}

const ErrorNoAccessToObject: FC<ErrorNoAccessToObjectProps> = ({
	description,
	visitorSpaceName,
	visitorSpaceSlug,
}) => {
	const { tHtml, tText } = useTranslation();
	const router = useRouter();

	const user = useSelector(selectUser);
	const { mutateAsync: createVisitRequest } = useCreateVisitRequest();

	const [isRequestAccessBladeOpen, setIsRequestAccessBladeOpen] = useState(false);

	const [, setQuery] = useQueryParams({
		[VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
	});

	const onRequestAccessSubmit = async (values: RequestAccessFormState) => {
		try {
			if (!user || !visitorSpaceSlug) {
				toastService.notify({
					title: tText(
						'modules/shared/components/media-card/media-card___je-bent-niet-ingelogd'
					),
					description: tText(
						'modules/shared/components/media-card/media-card___je-bent-niet-ingelogd-log-opnieuw-in-en-probeer-opnieuw'
					),
				});
				return;
			}

			const createdVisitRequest = await createVisitRequest({
				acceptedTos: values.acceptTerms,
				reason: values.requestReason,
				visitorSpaceSlug: visitorSpaceSlug as string,
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
				title: tText('modules/shared/components/media-card/media-card___er-ging-iets-mis'),
				description: tText(
					'modules/shared/components/media-card/media-card___er-ging-iets-mis-beschrijving'
				),
			});
		}
	};

	const onOpenRequestAccess = () => {
		setQuery({ [VISITOR_SPACE_SLUG_QUERY_KEY]: visitorSpaceSlug });
		setIsRequestAccessBladeOpen(true);
	};

	return (
		<>
			<ErrorPage
				title={tHtml(
					'modules/shared/components/error-no-access-to-object/error-no-access-to-object___je-hebt-geen-toegang'
				)}
				description={description}
				image={{ image: '/images/no-access.svg', left: true }}
				link={{
					component: (
						<Button
							label={tHtml(
								'modules/shared/components/error-no-access-to-object/error-no-access-to-object___verken-de-publieke-catalogus'
							)}
							variants={['white', 'outline']}
						/>
					),
					to: ROUTES.search,
				}}
				buttonsComponent={
					<div className={styles['p-error-no-access-to-object__buttons-container']}>
						<Button
							label={`${tHtml(
								'modules/shared/components/error-no-access-to-object/error-no-access-to-object___plan-een-bezoek-bij'
							)}${visitorSpaceName}`}
							variants="black"
							className={styles['p-error-no-access-to-object__button']}
							onClick={() => onOpenRequestAccess()}
						/>
					</div>
				}
			/>
			<RequestAccessBlade
				isOpen={isRequestAccessBladeOpen}
				onClose={() => setIsRequestAccessBladeOpen(false)}
				onSubmit={onRequestAccessSubmit}
			/>
		</>
	);
};

export default ErrorNoAccessToObject;
