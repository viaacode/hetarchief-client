import {
	AdminConfigManager,
	type ContentPageInfo,
	ContentPageRenderer,
	convertDbContentPageToContentPageInfo,
} from '@meemoo/admin-core-ui';
import { Button } from '@meemoo/react-components';
import { type Avo } from '@viaa/avo2-types';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { AuthService } from '@auth/services/auth-service';
import { selectUser } from '@auth/store/user';
import { useGetContentPageByLanguageAndPath } from '@content-page/hooks/get-content-page';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { GET_TOS_INDEX_QUERY_PARAM_CONFIG, KNOWN_STATIC_ROUTES } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import useStickyLayout from '@shared/hooks/use-sticky-layout/use-sticky-layout';
import { useTermsOfService } from '@shared/hooks/use-terms-of-service';
import { toastService } from '@shared/services/toast-service';
import { TosService } from '@shared/services/tos-service';
import { setShowZendesk } from '@shared/store/ui';
import { type DefaultSeoInfo } from '@shared/types/seo';

import styles from './UserConditions.module.scss';

export const UserConditions: FC<
	DefaultSeoInfo & { commonUser: Avo.User.CommonUser | undefined }
> = ({ url, commonUser }) => {
	useStickyLayout();
	useHideFooter();

	const router = useRouter();
	const locale = useLocale();
	const scrollable = useRef<HTMLDivElement | null>(null);
	const dispatch = useDispatch();

	const [query] = useQueryParams(GET_TOS_INDEX_QUERY_PARAM_CONFIG(locale));
	const [hasFinished, setHasFinished] = useState(false);
	const [isAtBottom, setIsAtBottom] = useState(false);
	const tosAccepted = useTermsOfService();
	const { data: dbContentPage } = useGetContentPageByLanguageAndPath(
		locale,
		KNOWN_STATIC_ROUTES.TermsOfService
	);
	const contentPageInfo = dbContentPage
		? convertDbContentPageToContentPageInfo(dbContentPage)
		: null;

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
		await AuthService.logout();
	}, []);

	const onConfirmClick = () => {
		if (user) {
			TosService.acceptTos(user?.id).then(() => {
				router.push(query[QUERY_PARAM_KEY.REDIRECT_TO_QUERY_KEY]);
				toastService.notify({
					title: tHtml('pages/gebruiksvoorwaarden/index___gebruiksvoorwaarden-aanvaard'),
					description: tHtml(
						'pages/gebruiksvoorwaarden/index___je-geniet-nu-van-volledige-toegang-tot-het-platform'
					),
					maxLines: 2,
				});
			});
		}
	};

	const renderPageContent = () => {
		return (
			<>
				<div className={styles['p-terms-of-service__background']} />

				<section className={clsx('u-pt-96', styles['p-terms-of-service__text'])}>
					<div className="l-container">
						<h1 className={styles['p-terms-of-service__title']}>
							{tHtml('pages/gebruiksvoorwaarden/index___gebruiksvoorwaarden')}
						</h1>

						<div
							ref={scrollable}
							onScroll={onContentScroll}
							className={styles['p-terms-of-service__content']}
						>
							{AdminConfigManager.getConfig() && (
								<ContentPageRenderer
									contentPageInfo={contentPageInfo as ContentPageInfo}
									commonUser={commonUser}
								/>
							)}
						</div>
					</div>
				</section>

				<div
					className={clsx(styles['p-terms-of-service__gradient'], {
						[styles['p-terms-of-service__gradient--hidden']]: isAtBottom || tosAccepted,
					})}
				/>

				{user && !tosAccepted && (
					<section
						className={clsx('u-pt-96', styles['p-terms-of-service__buttons-wrapper'])}
					>
						<div className="l-container">
							<div className={styles['p-terms-of-service__buttons']}>
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
		<div className={styles['p-terms-of-service']}>
			<SeoTags
				title={tText('pages/gebruiksvoorwaarden/index___gebruiksvoorwaarden')}
				description={tText(
					'pages/gebruiksvoorwaarden/index___gebruiksvoorwaarden-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>

			{renderPageContent()}
		</div>
	);
};
