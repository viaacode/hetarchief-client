import { Permission } from '@account/const';
import { Button } from '@meemoo/react-components';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { VisitorLayout } from '@visitor-layout/index';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import styles from './AccountMyApplicationListSent.module.scss';

export const AccountMyApplicationListSent: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
	useHideFooter(true);
	const locale = useLocale();

	const renderPageContent = () => {
		return (
			<section className={styles['p-application-list-success']}>
				<div className={styles['p-application-list-success__image-background']}>
					<h1 className={styles['p-application-list-success__title']}>
						{tHtml(
							'modules/account/components/application-list-sent/application-list-sent___je-aanvraag-werd-verstuurd'
						)}
					</h1>
					<div className={styles['p-application-list-success__image-wrapper']}>
						<Image unoptimized src="/images/request-sent.svg" alt="" fill sizes="100vw" />
					</div>
				</div>

				<div className={styles['p-application-list-success__info']}>
					<p className={styles['p-application-list-success__description']}>
						{tHtml(
							'modules/account/components/application-list-sent/application-list-sent___we-houden-je-op-de-hoogte-van-je-aanvragen-ondertussen-kan-je'
						)}
					</p>
					<div className={styles['p-application-list-success__button-component']}>
						<Link href={ROUTES_BY_LOCALE[locale].search}>
							<Button
								label={tHtml(
									'modules/account/components/application-list-sent/application-list-sent___zoeken-in-de-catalogus'
								)}
							/>
						</Link>
						<Link href={ROUTES_BY_LOCALE[locale].accountMyMaterialRequests}>
							<Button
								label={tHtml(
									'modules/account/components/application-list-sent/application-list-sent___mijn-materiaalaanvragen-raadplegen'
								)}
								variants={['silver']}
							/>
						</Link>
					</div>
				</div>
			</section>
		);
	};
	return (
		<VisitorLayout>
			<SeoTags
				title={tText(
					'modules/account/views/account-my-application-list___aanvraaglijst-meta-titel'
				)}
				description={tText(
					'modules/account/views/account-my-application-list___aanvraaglijst-meta-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>

			<PermissionsCheck allPermissions={[Permission.CREATE_MATERIAL_REQUESTS]}>
				<div className="u-bg-platinum">{renderPageContent()}</div>
			</PermissionsCheck>
		</VisitorLayout>
	);
};
