import { Button } from '@meemoo/react-components';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { tHtml } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import styles from './ApplicationListSent.module.scss';

const ApplicationListSent: FC = () => {
	const locale = useLocale();

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

export default ApplicationListSent;
