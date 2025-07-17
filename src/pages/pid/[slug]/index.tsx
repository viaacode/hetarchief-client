import { QueryClient } from '@tanstack/react-query';
import { kebabCase } from 'lodash-es';
import type { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import type { GetServerSidePropsContext } from 'next/types';
import { type ComponentType, type FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { GroupName } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import {
	makeServerSideRequestGetIeObjectInfo,
	useGetIeObjectInfo,
} from '@ie-objects/hooks/use-get-ie-objects-info';
import { ErrorNotFound } from '@shared/components/ErrorNotFound';
import { Loading } from '@shared/components/Loading';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import withUser, { type UserProps } from '@shared/hooks/with-user';
import { setShowZendesk } from '@shared/store/ui';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { VisitorLayout } from '@visitor-layout/index';

import styles from './index.module.scss';

const IeObjectLinkResolver: NextPage<DefaultSeoInfo & UserProps> = ({ url }) => {
	const router = useRouter();
	const locale = useLocale();
	const { slug: schemaIdentifier } = router.query;
	const dispatch = useDispatch();
	const isKioskUser = useHasAnyGroup(GroupName.KIOSK_VISITOR);

	/**
	 * Data
	 */

	const { data: ieObjectInfo, isError: isIeObjectError } = useGetIeObjectInfo(
		schemaIdentifier as string
	);

	/**
	 * Effects
	 */

	useEffect(() => {
		if (ieObjectInfo) {
			const objectDetailPagePath = `${ROUTES_BY_LOCALE[locale].search}/${
				ieObjectInfo.maintainerSlug
			}/${ieObjectInfo.schemaIdentifier}/${kebabCase(ieObjectInfo.name)}`;
			router.replace(objectDetailPagePath);
		}
	}, [ieObjectInfo, locale, router]);

	useEffect(() => {
		dispatch(setShowZendesk(!isKioskUser));
	}, [dispatch, isKioskUser]);

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (!ieObjectInfo && isIeObjectError) {
			return (
				<>
					<SeoTags
						title={tText('pages/404___niet-gevonden')}
						description={tText('pages/404___pagina-niet-gevonden')}
						imgUrl={undefined}
						translatedPages={[]}
						relativeUrl={url}
					/>
					<ErrorNotFound />
				</>
			);
		}

		return (
			<Loading
				fullscreen
				className={styles['p-pid__c-loading--fullscreen']}
				owner={'/pid/[...slug]/index page'}
			/>
		);
	};

	return <VisitorLayout>{renderPageContent()}</VisitorLayout>;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	const title: string | null = 'Home - Het Archief';
	const description: string | null = null;
	const image: string | null = null;
	const schemaIdentifier = context.query.schemaIdentifier as string;

	const queryClient = new QueryClient();
	await makeServerSideRequestGetIeObjectInfo(queryClient, schemaIdentifier);

	return getDefaultStaticProps(context, context.resolvedUrl, {
		queryClient,
		title,
		description,
		image,
	});
}

export default withUser(
	withAuth(IeObjectLinkResolver as ComponentType, false)
) as FC<DefaultSeoInfo>;
