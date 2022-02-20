import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import DOMPurify from 'isomorphic-dompurify';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { checkLoginAction, selectUser } from '@auth/store/user';
import { withI18n } from '@i18n/wrappers';
import {
	LOCAL_STORAGE,
	RICH_TEXT_SANITIZATION,
	ROUTES,
	TOS_INDEX_QUERY_PARAM_CONFIG,
} from '@shared/const';
import useStickyLayout from '@shared/hooks/use-sticky-layout/use-sticky-layout';
import { toastService } from '@shared/services';
import { TosService } from '@shared/services/tos-service';
import { createPageTitle } from '@shared/utils';

const lipsum =
	'<p>Lorem ipsum dolor sit amet, consectetur <b>adipiscing</b> elit. In cursus quis enim vel consectetur. Mauris imperdiet nibh et tortor eleifend pulvinar. Etiam eget varius ante, sit amet blandit justo. Nam a eleifend tortor. Duis quis risus finibus, efficitur quam ac, tristique ligula. Sed a sollicitudin neque, sed pellentesque justo. Donec suscipit, ex eget volutpat eleifend, purus velit pellentesque massa, et cursus leo metus in odio. Proin facilisis eros sit amet metus scelerisque sodales. Quisque sollicitudin dui lorem, sit amet vestibulum ligula fringilla eu. Vivamus rhoncus erat eu dui mattis lacinia.</p><p><b>Donec a convallis ante. Morbi ac tincidunt ligula, ut vestibulum arcu. Proin at vestibulum tortor. Suspendisse ac ultrices lorem, a aliquam diam. Curabitur consectetur mauris vel lacus pulvinar pharetra. Nam et ante vestibulum, venenatis nisl ut, tincidunt arcu. Phasellus accumsan blandit arcu, vitae condimentum ante varius quis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Curabitur eu auctor eros. Aliquam lorem metus, sagittis ac quam sit amet, sagittis tincidunt ex. Donec lobortis luctus mi.</b></p><p>Ut sit amet tortor eu urna interdum dictum in quis libero. Vestibulum condimentum, massa at sodales malesuada, ligula metus blandit lacus, in tincidunt sapien mauris ut nisl. Curabitur molestie dignissim nisl. Aenean eget diam nulla. Morbi mollis mauris felis. Suspendisse porttitor ex in ornare maximus. Curabitur ullamcorper, quam non maximus porta, erat enim rutrum sapien, vitae facilisis ante quam vitae ipsum. Proin mattis consequat sollicitudin. Nunc sit amet lobortis quam. Mauris scelerisque id urna ac facilisis. Suspendisse volutpat diam vel eleifend egestas. Quisque molestie, nunc id sodales aliquet, neque tellus euismod eros, id ullamcorper nisi mi non dui.</p><p>Proin imperdiet, metus ac vestibulum varius, erat arcu eleifend justo, non eleifend arcu mauris a sapien. Nullam viverra, est non finibus porta, ipsum lacus commodo diam, volutpat ultricies risus est et justo. Etiam auctor quam est, pharetra tincidunt nisi iaculis vel. Maecenas malesuada feugiat molestie. Aenean gravida erat non nisi blandit faucibus. Proin diam quam, dignissim in porta nec, volutpat vel risus. Ut ornare, sem vitae volutpat sollicitudin, mi ex tristique urna, eu convallis nisl diam ut tortor.</p><p>In cursus est nec arcu consectetur blandit. Morbi sed tempus lectus. Pellentesque sollicitudin justo a ex sollicitudin, vitae faucibus ante tempus. Donec placerat ac urna eu convallis. Phasellus sit amet sapien a felis suscipit cursus non eu libero. Duis mi neque, viverra id diam vel, varius sodales felis. Sed id nunc ut ligula volutpat vehicula. Ut viverra molestie nibh, in iaculis purus ultricies eget. Sed mauris massa, semper ac tempor eget, consectetur elementum massa. Nunc laoreet maximus arcu, ut molestie lacus aliquet vel. Curabitur eleifend egestas ligula nec ullamcorper.</p>';

const TermsOfService: NextPage = () => {
	useStickyLayout();

	const { t } = useTranslation();
	const router = useRouter();
	const scrollable = useRef<HTMLDivElement | null>(null);
	const dispatch = useDispatch();

	const [query] = useQueryParams(TOS_INDEX_QUERY_PARAM_CONFIG);
	const [hasFinished, setHasFinished] = useState(false);
	const [isAtBottom, setIsAtBottom] = useState(false);

	const user = useSelector(selectUser);

	const onContentScroll = useCallback(() => {
		const el = scrollable.current;

		if (el !== null) {
			const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 1;
			setIsAtBottom(bottom);

			if (bottom) {
				setHasFinished(true);
			}
		}
	}, [scrollable]);

	const onCancelClick = useCallback(() => {
		router.push(localStorage.getItem(LOCAL_STORAGE.previousPage) || ROUTES.home);

		toastService.notify({
			title: t(
				'pages/gebruiksvoorwaarden/index___je-koos-ervoor-om-niet-in-te-stemmen-met-de-gebruiksvoorwaarden'
			),
			description: t(
				'pages/gebruiksvoorwaarden/index___het-aanvaarden-van-de-voorwaarden-is-noodzakelijk-voor-volledige-toegang-tot-het-platform'
			),
			maxLines: 3,
		});
	}, [t, router]);

	const onConfirmClick = () => {
		user &&
			TosService.acceptTos(user?.id).then((updated) => {
				const decoded = decodeURIComponent(query.after);
				dispatch(checkLoginAction());

				// Execute in separate cycle
				updated.acceptedTosAt && setTimeout(() => router.push(decoded));
			});

		toastService.notify({
			title: t('pages/gebruiksvoorwaarden/index___gebruiksvoorwaarden-aanvaard'),
			description: t(
				'pages/gebruiksvoorwaarden/index___je-geniet-nu-van-volledige-toegang-tot-het-platform'
			),
			maxLines: 2,
		});
	};

	return (
		<div className="p-terms-of-service">
			<Head>
				<title>{createPageTitle('Gebruiksvoorwaarden')}</title>
				<meta
					name="description"
					content={t(
						'pages/gebruiksvoorwaarden/index___gebruiksvoorwaarden-omschrijving'
					)}
				/>
			</Head>

			<div className="p-terms-of-service__background" />

			<section className="u-pt-96 p-terms-of-service__text">
				<div className="l-container">
					<h1 className="p-terms-of-service__title">
						{t('pages/gebruiksvoorwaarden/index___gebruiksvoorwaarden')}
					</h1>

					<div
						ref={scrollable}
						onScroll={onContentScroll}
						className="p-terms-of-service__content"
						dangerouslySetInnerHTML={{
							__html: String(
								DOMPurify.sanitize(
									lipsum + lipsum, // rich-text content
									RICH_TEXT_SANITIZATION
								)
							),
						}}
					/>
				</div>
			</section>

			<div
				className={clsx('p-terms-of-service__gradient', {
					'p-terms-of-service__gradient--hidden': isAtBottom,
				})}
			/>

			<section className="u-pt-96 p-terms-of-service__buttons-wrapper">
				<div className="l-container">
					<div className="p-terms-of-service__buttons">
						<Button className="u-mr-8" variants="text" onClick={onCancelClick}>
							{t('pages/gebruiksvoorwaarden/index___annuleer')}
						</Button>
						<Button variants="black" disabled={!hasFinished} onClick={onConfirmClick}>
							{t('pages/gebruiksvoorwaarden/index___aanvaarden')}
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default TermsOfService;
