import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringify } from 'query-string';
import { FC } from 'react';

import ReadingRoomCardsWithSearch from '@home/components/ReadingRoomCardsWithSearch/ReadingRoomCardsWithSearch';
import { SHOW_AUTH_QUERY_KEY } from '@home/const';
import { ROUTES } from '@shared/const';
import { createPageTitle } from '@shared/utils';

import styles from './LoggedOutHome.module.scss';

const LoggedOutHome: FC = () => {
	const { t } = useTranslation();
	const router = useRouter();

	/**
	 * Methods
	 */

	const onRequestAccess = (readingRoomId: string) => {
		return router.push(
			`${ROUTES.home}?${stringify({
				[SHOW_AUTH_QUERY_KEY]: '1',
				readingRoomId,
			})}`
		);
	};

	/**
	 * Render
	 */

	return (
		<div className="p-home u-page-bottom-margin">
			<Head>
				<title>{createPageTitle('Home')}</title>
				<meta name="description" content="TODO: Home meta description" />
			</Head>

			<div className={styles['c-hero']}>
				<div className={styles['c-hero__image']}>
					<Image
						src="/images/hero.jpg"
						layout="fill"
						alt="Hero image"
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

			<ReadingRoomCardsWithSearch onRequestAccess={onRequestAccess} />
		</div>
	);
};

export default LoggedOutHome;
