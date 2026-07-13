import { GroupName } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import {
	getContentPageByLanguageAndPath,
	useGetContentPageByLanguageAndPath,
} from '@content-page/hooks/get-content-page';
import type { IeObjectRepresentation } from '@ie-objects/ie-objects.types';
import { convertDbContentPageToContentPageInfo } from '@meemoo/admin-core-ui/admin';
import { ContentPageRenderer } from '@meemoo/admin-core-ui/client';
import { Button } from '@meemoo/react-components';
import { FlowplayerMinimal } from '@shared/components/FlowplayerMinimal/FlowplayerMinimal';
import Icon from '@shared/components/Icon/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import getConfig from '@shared/config/public-runtime-config';
import { KNOWN_STATIC_ROUTES, QUERY_KEYS, ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { useTriggerEventOnPageLoad } from '@shared/hooks/use-trigger-event-on-page-load/use-trigger-event-on-page-load';
import { LogEventType } from '@shared/services/events-service';
import { IeObjectType } from '@shared/types/ie-objects';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { Locale } from '@shared/utils/i18n';
import { QueryClient } from '@tanstack/react-query';
import { VisitorLayout } from '@visitor-layout/index';
import { noop } from 'es-toolkit/compat';
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import getConfig from 'next/config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type ComponentType, type FC, useEffect, useState } from 'react';
import ErrorNoAccess from '../modules/shared/components/ErrorNoAccess/ErrorNoAccess';

const { publicRuntimeConfig } = getConfig();

const Homepage: NextPage<DefaultSeoInfo> = ({ title, description, image, url }) => {
	const isKioskUser = useHasAnyGroup(GroupName.KIOSK_VISITOR);
	const router = useRouter();
	const locale = useLocale();

	/**
	 * Data
	 */

	const { isLoading: isContentPageLoading, data: dbContentPage } =
		useGetContentPageByLanguageAndPath(locale, '/');
	const contentPageInfo = dbContentPage
		? convertDbContentPageToContentPageInfo(dbContentPage)
		: null;

	const [isPaused, setIsPaused] = useState<boolean>(false); // autoplay
	const [isMute, setIsMute] = useState<boolean>(true);

	/**
	 * At startup check if user is a kiosk user, if so redirect to search page since kiosk users should only be used for searching
	 */
	useEffect(() => {
		if (isKioskUser) {
			router.replace(ROUTES_BY_LOCALE[locale].search).then(noop);
		}
	}, [router, isKioskUser, locale]);

	/**
	 * At startup trigger a content page viewed event
	 */
	useTriggerEventOnPageLoad({
		eventType: LogEventType.CONTENT_PAGE_VIEW,
		eventData: contentPageInfo ? { type: contentPageInfo.contentType } : undefined,
		shouldTrigger: !!contentPageInfo,
	});

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (isContentPageLoading || isKioskUser) {
			return <Loading fullscreen locationId="homepage" />;
		}
		if (contentPageInfo) {
			const mockRepresentation = {
				id: 'https://data-qas.hetarchief.be/id/entity/5a74993456e88271ccae08421eec6b2c',
				schemaName: "Lageresolutiekopie (mp4): 'Mortsels Drankje' (qsnk362q84)",
				schemaInLanguage: null,
				schemaStartTime: null,
				schemaEndTime: null,
				schemaTranscriptUrl: null,
				edmIsNextInSequence: null,
				updatedAt: '2026-06-26T20:56:17.885088+00:00',
				isMediaFragmentOf: null,
				files: [
					{
						id: 'https://data-qas.hetarchief.be/id/entity/eb24382c694cf5913e415103ae058230',
						name: 'browse.mp4',
						mimeType: 'video/mp4',
						storedAt:
							'https://media-qas.viaa.be/play/v2/ATV/b35f44362fa541b0baa8439e5368c0377fa9e854cfb74af2932651d17aaeba00/browse.mp4',
						thumbnailUrl:
							'https://media-qas.viaa.be/play/v2/ATV/b35f44362fa541b0baa8439e5368c0377fa9e854cfb74af2932651d17aaeba00/keyframes-thumb/keyframes_1_1/keyframe1.jpg?token=eyJraWQiOiIwMDAyIiwiYWxnIjoiSFMyNTYifQ.eyJhdWQiOiJoZXRhcmNoaWVmLmJlIiwiZXhwIjoxNzgzMDA4NTU0LCJzdWIiOiJBVFYvYjM1ZjQ0MzYyZmE1NDFiMGJhYTg0MzllNTM2OGMwMzc3ZmE5ZTg1NGNmYjc0YWYyOTMyNjUxZDE3YWFlYmEwMC9rZXlmcmFtZXMtdGh1bWIva2V5ZnJhbWVzXzFfMS9rZXlmcmFtZTEuanBnIiwiaXAiOiI4MS4yNDUuNC4yMjYiLCJyZWZlcmVyIjoiaHR0cDovL2xvY2FsaG9zdDozMjAwIiwiZnJhZ21lbnQiOltdfQ.wuIHNgv1Z7fESYvtZiRDHAJf0RObflzdlhFN3UklnaU',
						duration: 83.32,
						edmIsNextInSequence: null,
						createdAt: '2026-06-09T22:14:54.447138+00:00',
						mediaFragment: null,
					},
					{
						id: 'https://data-qas.hetarchief.be/id/entity/80bfa3bfcdc4536782f4ff6bcd9535aa',
						name: 'peak-0.json',
						mimeType: 'application/json',
						storedAt:
							'https://media-qas.viaa.be/play/v2/ATV/b35f44362fa541b0baa8439e5368c0377fa9e854cfb74af2932651d17aaeba00/peak-0.json',
						thumbnailUrl:
							'https://media-qas.viaa.be/play/v2/ATV/b35f44362fa541b0baa8439e5368c0377fa9e854cfb74af2932651d17aaeba00/keyframes-thumb/keyframes_1_1/keyframe1.jpg?token=eyJraWQiOiIwMDAyIiwiYWxnIjoiSFMyNTYifQ.eyJhdWQiOiJoZXRhcmNoaWVmLmJlIiwiZXhwIjoxNzgzMDA4NTU0LCJzdWIiOiJBVFYvYjM1ZjQ0MzYyZmE1NDFiMGJhYTg0MzllNTM2OGMwMzc3ZmE5ZTg1NGNmYjc0YWYyOTMyNjUxZDE3YWFlYmEwMC9rZXlmcmFtZXMtdGh1bWIva2V5ZnJhbWVzXzFfMS9rZXlmcmFtZTEuanBnIiwiaXAiOiI4MS4yNDUuNC4yMjYiLCJyZWZlcmVyIjoiaHR0cDovL2xvY2FsaG9zdDozMjAwIiwiZnJhZ21lbnQiOltdfQ.wuIHNgv1Z7fESYvtZiRDHAJf0RObflzdlhFN3UklnaU',
						duration: null,
						edmIsNextInSequence: null,
						createdAt: '2026-06-09T22:14:31.651556+00:00',
						mediaFragment: null,
					},
				],
			};
			return (
				<>
					<div style={{ width: '600px', margin: '0 auto' }}>
						<FlowplayerMinimal
							id="flowplayer-minimal-homepage"
							dctermsFormat={IeObjectType.VIDEO}
							schemaIdentifier="qsnk362q84"
							representation={mockRepresentation as unknown as IeObjectRepresentation}
							poster={mockRepresentation.files[1]?.thumbnailUrl}
							autoplay={true}
							isPaused={isPaused}
							setIsPaused={setIsPaused}
							isMuted={isMute}
							setIsMuted={(newIsMuteValue) => setIsMute(newIsMuteValue)}
						/>
						<div>
							<Button onClick={() => setIsPaused(!isPaused)}>
								{isPaused ? (
									<Icon name={IconNamesLight.Play} />
								) : (
									<Icon name={IconNamesLight.Pause} />
								)}
							</Button>
							<Button onClick={() => setIsMute(!isMute)}>
								{isMute ? (
									<Icon name={IconNamesLight.Audio} />
								) : (
									<Icon name={IconNamesLight.NoAudio} />
								)}
							</Button>

							<Link href="/pid/qsnk362q84" passHref>
								<Button>Bekijk het fragment</Button>
							</Link>
						</div>
					</div>
					<ContentPageRenderer
						contentPageInfo={contentPageInfo}
						renderNoAccessError={() => <ErrorNoAccess visitorSpaceSlug={null} />}
					/>
				</>
			);
		}
	};

	return (
		<VisitorLayout>
			<SeoTags
				title={title || null}
				description={
					description || contentPageInfo?.seoDescription || contentPageInfo?.description || null
				}
				imgUrl={image || contentPageInfo?.thumbnailPath || null}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={publicRuntimeConfig.CLIENT_URL}
			/>
			{renderPageContent()}
		</VisitorLayout>
	);
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	let title: string | null = null;
	let description: string | null = null;
	let image: string | null = null;
	try {
		const contentPage = await getContentPageByLanguageAndPath(Locale.nl, '/');
		title = contentPage?.title || null;
		description = contentPage?.seoDescription || contentPage?.description || null;
		image = contentPage?.thumbnailPath || null;
	} catch (err) {
		console.error({
			message: 'Failed to fetch content page seo info for homepage by slug: ',
			innerException: err,
			additionalInfo: {
				path: '/',
			},
		});
	}

	const queryClient = new QueryClient();

	const language = (context.locale || Locale.nl) as Locale;
	const path = KNOWN_STATIC_ROUTES[language].Home;
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getContentPage, path, language],
		queryFn: () => getContentPageByLanguageAndPath(language, path),
	});

	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.home, {
		queryClient,
		title,
		description,
		image,
	});
}

export default withAuth(Homepage as ComponentType, false) as FC<DefaultSeoInfo>;
