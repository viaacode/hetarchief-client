import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringify } from 'query-string';
import { type FC, useEffect } from 'react';
import { BooleanParam, StringParam, useQueryParams } from 'use-query-params';

import VisitorSpaceCardsWithSearch from '@home/components/VisitorSpaceCardsWithSearch/VisitorSpaceCardsWithSearch';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { KNOWN_STATIC_ROUTES, ROUTES_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';

import styles from './LoggedOutVisitorSpacesHome.module.scss';

const LoggedOutVisitorSpacesHome: FC = () => {
	const router = useRouter();
	const locale = useLocale();

	const [query] = useQueryParams({
		[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
		[QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY]: BooleanParam,
	});

	/**
	 * Methods
	 */

	const onRequestAccess = (visitorSpaceSlug: string) => {
		return router.push(
			`${ROUTES_BY_LOCALE[locale].visit}?${stringify({
				[QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY]: '1',
				[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: visitorSpaceSlug,
			})}`
		);
	};

	useEffect(() => {
		if (
			query[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY] &&
			!query[QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY]
		) {
			router.push(
				`${ROUTES_BY_LOCALE[locale].visit}?${stringify({
					[QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY]: '1',
					[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]:
						query[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY],
				})}`
			);
		}
	}, [locale, query, router]);

	/**
	 * Render
	 */

	const renderPageContent = () => {
		return (
			<>
				<div className={styles['c-hero']}>
					<div className={styles['c-hero__image']}>
						<Image
							src="/images/hero.jpg"
							alt={tText('modules/home/components/logged-out-home/logged-out-home___hero-alt')}
							priority
							fill
							sizes="100vw"
							style={{
								objectFit: 'contain',
							}}
						/>
					</div>
					<div className={styles['c-hero__content']}>
						<h1 className={styles['c-hero__title']}>
							{tHtml('pages/index___logged-out-home-title')}
						</h1>
						<p className={styles['c-hero__description']}>
							{tHtml('pages/index___logged-out-home-description')}
						</p>
						<b>
							<Link
								href={KNOWN_STATIC_ROUTES[locale].aboutTheVisitorTool}
								className={styles['c-hero__link']}
							>
								{tHtml('pages/index___hier-kom-je-er-alles-over-te-weten')}
							</Link>
						</b>

						<Icon name={IconNamesLight.ArrowDown} className={styles['c-hero__arrow-down']} />
					</div>
				</div>
				<VisitorSpaceCardsWithSearch onRequestAccess={onRequestAccess} />
			</>
		);
	};

	return <div className="p-home u-page-bottom-padding">{renderPageContent()}</div>;
};

export default LoggedOutVisitorSpacesHome;
