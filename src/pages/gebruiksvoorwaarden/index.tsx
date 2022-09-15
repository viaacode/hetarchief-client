import { ContentPage } from '@meemoo/react-admin';
import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { AuthService } from '@auth/services/auth-service';
import { checkLoginAction, selectUser } from '@auth/store/user';
import { withI18n } from '@i18n/wrappers';
import { REDIRECT_TO_QUERY_KEY, TOS_INDEX_QUERY_PARAM_CONFIG } from '@shared/const';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import useStickyLayout from '@shared/hooks/use-sticky-layout/use-sticky-layout';
import { useTermsOfService } from '@shared/hooks/use-terms-of-service';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { TosService } from '@shared/services/tos-service';
import { setShowZendesk } from '@shared/store/ui';
import { createPageTitle } from '@shared/utils';

const TermsOfService: NextPage = () => {
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

	return (
		<div className="p-terms-of-service">
			<Head>
				<title>{createPageTitle('Gebruiksvoorwaarden')}</title>
				<meta
					name="description"
					content={tText(
						'pages/gebruiksvoorwaarden/index___gebruiksvoorwaarden-omschrijving'
					)}
				/>
			</Head>

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
						<ContentPage
							path="/gebruikersvoorwaarden-tekst"
							userGroupId={user?.groupId}
						/>
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
		</div>
	);
};

export const getServerSideProps = withI18n();

export default withAdminCoreConfig(TermsOfService);
