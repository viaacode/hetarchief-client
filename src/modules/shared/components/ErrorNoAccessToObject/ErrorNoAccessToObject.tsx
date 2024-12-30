import { Button } from '@meemoo/react-components';
import { useRouter } from 'next/router';
import { type FC, type ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';

import { GroupName } from '@account/const';
import {
	RequestAccessBlade,
	type RequestAccessFormState,
} from '@home/components/RequestAccessBlade';
import { useCreateVisitRequest } from '@home/hooks/create-visit-request';
import { ErrorPage } from '@shared/components/ErrorPage';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
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
	const router = useRouter();
	const locale = useLocale();
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
				ROUTES_BY_LOCALE[locale].visitRequested.replace(
					':slug',
					createdVisitRequest.spaceSlug
				)
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
					to: ROUTES_BY_LOCALE[locale].search,
				}}
				buttonsComponent={
					<div className={styles['p-error-no-access-to-object__buttons-container']}>
						<Button
							label={`${tHtml(
								'modules/shared/components/error-no-access-to-object/error-no-access-to-object___plan-een-bezoek-bij'
							)} ${visitorSpaceName}`}
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
				id="error-no-access-to-object__request-access-blade"
			/>
		</>
	);
};

export default ErrorNoAccessToObject;
