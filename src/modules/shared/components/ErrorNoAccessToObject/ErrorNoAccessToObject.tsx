import { Button } from '@meemoo/react-components';
import { useRouter } from 'next/router';
import { type FC, type ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';

import { GroupName } from '@account/const';
import { selectCommonUser } from '@auth/store/user';
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
import Link from 'next/link';
import { stringifyUrl } from 'query-string';
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
	const commonUser = useSelector(selectCommonUser);
	const isKioskUser = useHasAnyGroup(GroupName.KIOSK_VISITOR);
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
				ROUTES_BY_LOCALE[locale].visitRequested.replace(':slug', createdVisitRequest.spaceSlug)
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: render loop
	useEffect(() => {
		if (query[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]) {
			setIsRequestAccessBladeOpen(true);
		}
	}, []);

	const getRequestAccessUrl = () => {
		if (!visitorSpaceSlug) {
			console.error('Visitor space slug is required to request access.');
			return '#';
		}
		if (isAnonymous) {
			const redirectAfterLoginUrl = stringifyUrl({
				url: `/${ROUTES_BY_LOCALE[locale].visit}`,
				query: { [QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: visitorSpaceSlug.toLowerCase() },
			});
			return stringifyUrl({
				url: router.asPath,
				query: {
					[QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY]: 'true',
					[QUERY_PARAM_KEY.REDIRECT_TO_QUERY_KEY]: redirectAfterLoginUrl,
				},
			});
		}
		return stringifyUrl({
			url: `/${ROUTES_BY_LOCALE[locale].visit}`,
			query: {
				[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: visitorSpaceSlug.toLowerCase(),
			},
		});
	};

	const handleAccessToVisitorSpaceButtonClicked = () => {
		if (isAnonymous) {
			dispatch(setShowAuthModal(true));
		}
	};

	const canRequestVisitorSpaceAccess = isAnonymous || (!!visitorSpaceSlug && !isKioskUser);
	const canViewPublicCatalog = !isKioskUser;
	return (
		<>
			<ErrorPage
				title={tHtml(
					'modules/shared/components/error-no-access-to-object/error-no-access-to-object___je-hebt-geen-toegang'
				)}
				description={description}
				image={{ image: '/images/no-access.svg', left: true }}
				buttonsComponent={
					<div className={styles['p-error-no-access-to-object__buttons-container']}>
						{canRequestVisitorSpaceAccess && (
							<Link href={getRequestAccessUrl()}>
								<Button
									label={`${tText('modules/shared/components/error-no-access-to-object/error-no-access-to-object___plan-een-bezoek-bij')} ${visitorSpaceName}`}
									variants="black"
									className={styles['p-error-no-access-to-object__button']}
									onClick={handleAccessToVisitorSpaceButtonClicked}
								/>
							</Link>
						)}
						{canViewPublicCatalog && (
							<Link href={ROUTES_BY_LOCALE[locale].search} className="u-mt-16">
								<Button
									label={tHtml(
										'modules/shared/components/error-no-access-to-object/error-no-access-to-object___verken-de-publieke-catalogus'
									)}
									variants={['white', 'outline']}
								/>
							</Link>
						)}
						{!canViewPublicCatalog && (
							<Link href={ROUTES_BY_LOCALE[locale].search} className="u-mt-16">
								<Button
									label={tHtml(
										'modules/shared/components/error-no-access-to-object/error-no-access-to-object___zoek-verder-in-het-archief-van-organisation-name',
										{
											organisationName: commonUser?.organisation?.name,
										}
									)}
									variants={['white', 'outline']}
								/>
							</Link>
						)}
					</div>
				}
			/>
			<RequestAccessBlade
				isOpen={!isAnonymous && isRequestAccessBladeOpen}
				onClose={() => setIsRequestAccessBladeOpen(false)}
				onSubmit={onRequestAccessSubmit}
				id="error-no-access-to-object__request-access-blade"
			/>
		</>
	);
};

export default ErrorNoAccessToObject;
