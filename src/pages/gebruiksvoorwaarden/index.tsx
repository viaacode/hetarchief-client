import { ContentPageRenderer } from '@meemoo/admin-core-ui';
import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { AuthService } from '@auth/services/auth-service';
import { checkLoginAction, selectUser } from '@auth/store/user';
import {
	KNOWN_STATIC_ROUTES,
	REDIRECT_TO_QUERY_KEY,
	TOS_INDEX_QUERY_PARAM_CONFIG,
} from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import useStickyLayout from '@shared/hooks/use-sticky-layout/use-sticky-layout';
import { useTermsOfService } from '@shared/hooks/use-terms-of-service';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { TosService } from '@shared/services/tos-service';
import { setShowZendesk } from '@shared/store/ui';
import { DefaultSeoInfo } from '@shared/types/seo';

import { useGetContentPageByPath } from 'modules/content-page/hooks/get-content-page';

const TermsOfService: NextPage<DefaultSeoInfo> = ({ url }) => {
	useStickyLayout();
	useHideFooter();

	const { tHtml, tText } = useTranslation();
	const router = useRouter();
	const scrollable = useRef<HTMLDivElement | null>(null);
	const dispatch = useDispatch();

	const [query] = useQueryParams(TOS_INDEX_QUERY_PARAM_CONFIG);
	const [hasFinished, setHasFinished] = useState(false);
	const [isAtBottom, setIsAtBottom] = useState(false);
	const tosAccepted = useTermsOfService();
	const { data: contentPageInfo } = useGetContentPageByPath(KNOWN_STATIC_ROUTES.TermsOfService);

	const user = useSelector(selectUser);

	useEffect(() => {
		dispatch(setShowZendesk(false));
	}, [dispatch]);

	const onContentScroll = useCallback(() => {
		const el = scrollable.current;

		if (el !== null) {
			const bottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 20; // 20px margin, since 1px sometimes doesn't trigger correctly
			setIsAtBottom(bottom);

			if (bottom) {
				setHasFinished(true);
			}
		}
	}, [scrollable]);

	const onCancelClick = useCallback(async () => {
		AuthService.logout();
	}, []);

	const onConfirmClick = () => {
		if (user) {
			TosService.acceptTos(user?.id).then((updated) => {
				dispatch(checkLoginAction());

				if (updated.acceptedTosAt) {
					// Execute in separate cycle
					setTimeout(() =>
						router.push(query[REDIRECT_TO_QUERY_KEY]).then(() => {
							toastService.notify({
								title: tHtml(
									'pages/gebruiksvoorwaarden/index___gebruiksvoorwaarden-aanvaard'
								),
								description: tHtml(
									'pages/gebruiksvoorwaarden/index___je-geniet-nu-van-volledige-toegang-tot-het-platform'
								),
								maxLines: 2,
							});
						})
					);
				}
			});
		}
	};

	const renderPageContent = () => {
		return (
			<>
				<div className="p-terms-of-service__background" />

				<section className="u-pt-96 p-terms-of-service__text">
					<div className="l-container">
						<h1 className="p-terms-of-service__title">
							{tHtml('pages/gebruiksvoorwaarden/index___gebruiksvoorwaarden')}
						</h1>

						<div
							ref={scrollable}
							onScroll={onContentScroll}
							className="p-terms-of-service__content"
						>
							<ContentPageRenderer contentPageInfo={contentPageInfo} />
						</div>
					</div>
				</section>

				<div
					className={clsx('p-terms-of-service__gradient', {
						'p-terms-of-service__gradient--hidden': isAtBottom || tosAccepted,
					})}
				/>

				{user && !tosAccepted && (
					<section className="u-pt-96 p-terms-of-service__buttons-wrapper">
						<div className="l-container">
							<div className="p-terms-of-service__buttons">
								<Button className="u-mr-8" variants="text" onClick={onCancelClick}>
									{tHtml('pages/gebruiksvoorwaarden/index___annuleer')}
								</Button>

								<Button
									variants="black"
									disabled={!hasFinished}
									onClick={onConfirmClick}
								>
									{tHtml('pages/gebruiksvoorwaarden/index___aanvaarden')}
								</Button>
							</div>
						</div>
					</section>
				)}
			</>
		);
	};

	return (
		<div className="p-terms-of-service">
			{renderOgTags(
				tText('pages/gebruiksvoorwaarden/index___gebruiksvoorwaarden'),
				tText('pages/gebruiksvoorwaarden/index___gebruiksvoorwaarden-omschrijving'),
				url
			)}

			{renderPageContent()}
		</div>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default withAdminCoreConfig(TermsOfService as ComponentType);
