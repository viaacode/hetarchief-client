import { capitalize, lowerCase } from 'lodash-es';
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
import { Icon } from '@shared/components';
import { ROUTE_PARTS, ROUTES } from '@shared/const';
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

	const getPageDescription = () => {
		// eg: /vrt/09f17b37445c4ce59f645c2d5db9dbf8dbee79eba623459caa8c6496108641a0900618cb6ceb4e9b8ad907e47b980ee3
		const redirectTo = router.query.redirectTo as string;
		const firstUrlPart = redirectTo?.split('/')?.[1];
		if (!Object.values(ROUTE_PARTS).includes(firstUrlPart)) {
			// Not a static page => might be visitor space slug
			return capitalize(lowerCase(firstUrlPart));
		}
		return t('pages/index___logged-out-home-description');
	};

	/**
	 * Render
	 */

	return (
		<div className="p-home u-page-bottom-padding">
			<Head>
				<title>{createPageTitle('Home')}</title>
				<meta name="description" content={getPageDescription()} />
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
						<Link href="/over-de-bezoekertool">
							<a className={styles['c-hero__link']}>
								{t('pages/index___hier-kom-je-er-alles-over-te-weten')}
							</a>
						</Link>
					</b>

					<Icon name="arrow-down" type="light" className={styles['c-hero__arrow-down']} />
				</div>
			</div>

			<VisitorSpaceCardsWithSearch onRequestAccess={onRequestAccess} />
		</div>
	);
};

export default LoggedOutHome;
