import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringify } from 'query-string';
import { FC, useEffect } from 'react';
import { BooleanParam, StringParam, useQueryParams } from 'use-query-params';

import VisitorSpaceCardsWithSearch from '@home/components/VisitorSpaceCardsWithSearch/VisitorSpaceCardsWithSearch';
import { SHOW_AUTH_QUERY_KEY, VISITOR_SPACE_SLUG_QUERY_KEY } from '@home/const';
import { ROUTES } from '@shared/const';
import { createPageTitle } from '@shared/utils';

import styles from './LoggedOutHome.module.scss';

const LoggedOutHome: FC = () => {
	const { t } = useTranslation();
	const router = useRouter();

	const [query] = useQueryParams({
		[VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
		[SHOW_AUTH_QUERY_KEY]: BooleanParam,
	});

	/**
	 * Methods
	 */

	const onRequestAccess = (visitorSpaceSlug: string) => {
		return router.push(
			`${ROUTES.home}?${stringify({
				[SHOW_AUTH_QUERY_KEY]: '1',
				[VISITOR_SPACE_SLUG_QUERY_KEY]: visitorSpaceSlug,
			})}`
		);
	};

	useEffect(() => {
		if (query[VISITOR_SPACE_SLUG_QUERY_KEY] && !query[SHOW_AUTH_QUERY_KEY]) {
			router.push(
				`${ROUTES.home}?${stringify({
					[SHOW_AUTH_QUERY_KEY]: '1',
					[VISITOR_SPACE_SLUG_QUERY_KEY]: query[VISITOR_SPACE_SLUG_QUERY_KEY],
				})}`
			);
		}
	}, [query, router]);

	/**
	 * Render
	 */

	return (
		<div className="p-home u-page-bottom-padding">
			<Head>
				<title>{createPageTitle('Home')}</title>
				<meta name="description" content="TODO: Home meta description" />
			</Head>

			<div className={styles['c-hero']}>
				<div className={styles['c-hero__image']}>
					<Image
						src="/images/hero.jpg"
						layout="fill"
						alt={t(
							'modules/home/components/logged-out-home/logged-out-home___hero-alt'
						)}
						objectFit="contain"
					/>
				</div>
				<div className={styles['c-hero__content']}>
					<h1 className={styles['c-hero__title']}>
						{t('pages/index___logged-out-home-title')}
					</h1>
					<p className={styles['c-hero__description']}>
						{t('pages/index___logged-out-home-description')}
					</p>
					<b>
						<Link href="#">
							<a className={styles['c-hero__link']} target="_self">
								{t('pages/index___hier-kom-je-er-alles-over-te-weten')}
							</a>
						</Link>
					</b>
				</div>
			</div>

			<VisitorSpaceCardsWithSearch onRequestAccess={onRequestAccess} />
		</div>
	);
};

export default LoggedOutHome;
