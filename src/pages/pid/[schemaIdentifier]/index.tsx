import { GroupName } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import {
	makeServerSideRequestGetIeObjectInfo,
	useGetIeObjectBySchemaIdentifier,
} from '@ie-objects/hooks/use-get-ie-object-by-schema-identifier';
import { makeServerSideRequestGetIeObjectThumbnail } from '@ie-objects/hooks/use-get-ie-objects-thumbnail';
import { MIN_LENGTH_SCHEMA_IDENTIFIER_V2 } from '@ie-objects/ie-objects.consts';
import { IeObjectsService } from '@ie-objects/services';
import { ErrorNotFound } from '@shared/components/ErrorNotFound';
import { Loading } from '@shared/components/Loading';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import {
	getIeObjectDetailPath,
	getIeObjectDetailRedirectDestination,
} from '@shared/helpers/ie-object-urls';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import withUser, { type UserProps } from '@shared/hooks/with-user';
import { setShowZendesk } from '@shared/store/ui';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { Locale } from '@shared/utils/i18n';
import { QueryClient } from '@tanstack/react-query';
import { VisitorLayout } from '@visitor-layout/index';
import type { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import type { GetServerSidePropsContext } from 'next/types';
import { type ComponentType, type FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styles from './index.module.scss';

const IeObjectPidRouteRedirect: NextPage<DefaultSeoInfo & UserProps> = ({
	url,
	title,
	description,
	image,
	canonicalUrl,
}) => {
	const router = useRouter();
	const locale = useLocale();
	const schemaIdentifier = router.query.schemaIdentifier;
	const dispatch = useDispatch();
	const isKioskUser = useHasAnyGroup(GroupName.KIOSK_VISITOR);

	/**
	 * Data
	 */

	const { data: ieObjectInfo, isError: isIeObjectError } = useGetIeObjectBySchemaIdentifier(
		schemaIdentifier as string,
		false
	);

	/**
	 * Effects
	 */

	useEffect(() => {
		if (ieObjectInfo) {
			const objectDetailPagePath = getIeObjectDetailPath(
				locale,
				ieObjectInfo.maintainerSlug,
				ieObjectInfo.schemaIdentifier,
				ieObjectInfo.name
			);
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
			return <ErrorNotFound />;
		}

		return (
			<Loading
				fullscreen
				className={styles['p-pid__c-loading--fullscreen']}
				locationId={'/pid/[slug]/index page'}
			/>
		);
	};

	return (
		<VisitorLayout>
			<SeoTags
				title={title}
				description={description}
				imgUrl={image}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>
			{renderPageContent()}
		</VisitorLayout>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	const schemaIdentifier = context.query.schemaIdentifier as string;
	const locale = (context.locale || Locale.nl) as Locale;

	// Redirect server side whenever the object can be resolved, so crawlers get a proper redirect
	// instead of a 200 page. Objects that cannot be resolved server side (eg private objects that
	// return a 403) fall back to the client side redirect in the component above.
	try {
		let newSchemaIdentifier = schemaIdentifier;
		if (schemaIdentifier.length > MIN_LENGTH_SCHEMA_IDENTIFIER_V2) {
			// This is an old schema identifier (v2), we need to convert it to a new one (v3)
			const v3IdentifierResponse = await IeObjectsService.lookupV2Id(schemaIdentifier);
			newSchemaIdentifier = v3IdentifierResponse.schemaIdentifierV3;
		}
		const ieObject = (
			await IeObjectsService.getBySchemaIdentifiers([newSchemaIdentifier], false)
		)?.[0];
		if (ieObject?.maintainerSlug) {
			return {
				redirect: {
					// Next.js uses the destination verbatim, so the locale prefix has to be included
					destination: getIeObjectDetailRedirectDestination(
						locale,
						ieObject.maintainerSlug,
						ieObject.schemaIdentifier,
						ieObject.name
					),
					permanent: true,
				},
			};
		}
	} catch (err) {
		console.error(`Failed to resolve pid server side: ${schemaIdentifier}`, err);
	}

	const queryClient = new QueryClient();
	await makeServerSideRequestGetIeObjectInfo(queryClient, schemaIdentifier, false);
	await makeServerSideRequestGetIeObjectThumbnail(queryClient, schemaIdentifier);

	return getDefaultStaticProps(context, context.resolvedUrl, {
		queryClient,
		schemaIdentifier,
	});
}

export default withUser(
	withAuth(IeObjectPidRouteRedirect as ComponentType, false)
) as FC<DefaultSeoInfo>;
