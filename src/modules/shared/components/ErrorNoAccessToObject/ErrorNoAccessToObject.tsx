import { Button } from '@meemoo/react-components';
import { useRouter } from 'next/router';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';

import { GroupName } from '@account/const';
import { RequestAccessBlade, RequestAccessFormState } from '@home/components';
import { useCreateVisitRequest } from '@home/hooks/create-visit-request';
import { ErrorPage } from '@shared/components';
import { ROUTES } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { setShowAuthModal } from '@shared/store/ui';

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
	const dispatch = useDispatch();
	const isAnonymous = useHasAnyGroup(GroupName.ANONYMOUS);

	const { mutateAsync: createVisitRequest } = useCreateVisitRequest();

	const [isRequestAccessBladeOpen, setIsRequestAccessBladeOpen] = useState(false);

	const [query, setQuery] = useQueryParams({
		[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
	});

	const onRequestAccessSubmit = async (values: RequestAccessFormState) => {
		try {
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

	useEffect(() => {
		if (query[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]) {
			setIsRequestAccessBladeOpen(true);
		}
	}, []);

	const onOpenRequestAccess = () => {
		setQuery({ [QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: visitorSpaceSlug });
		if (isAnonymous) {
			dispatch(setShowAuthModal(true));
			return;
		}
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
